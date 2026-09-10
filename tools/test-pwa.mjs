import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const origin = 'https://example.test';
const url = (path) => new URL(path, origin).href;
const key = (request) => typeof request === 'string' ? url(request) : request.url;

function worker(source, purge = false) {
  const handlers = {};
  const stores = new Map();
  let offline = false;
  let quotaExceeded = false;
  const config = {
    purge, cacheName: 'chirpy-test', maxEntries: 2,
    resources: ['/'], denyPaths: ['/private'],
    allowedOrigins: ['https://cdn.jsdelivr.net']
  };
  const open = async (name) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const entries = stores.get(name);
    return {
      addAll: async (paths) => paths.forEach((p) => entries.set(url(p), new Response('precache'))),
      put: async (request, response) => {
        if (quotaExceeded) throw new Error('QuotaExceededError');
        entries.set(key(request), response);
      },
      keys: async () => [...entries.keys()],
      delete: async (request) => entries.delete(key(request))
    };
  };
  vm.runInNewContext(source, {
    URL, Promise, swconf: config, importScripts() {},
    console: { warn() {} },
    self: { location: { origin }, addEventListener: (name, fn) => handlers[name] = fn },
    caches: {
      open,
      keys: async () => [...stores.keys()],
      delete: async (name) => stores.delete(name),
      match: async (request, options) => stores.get(options.cacheName)?.get(key(request))?.clone()
    },
    fetch: async (request) => {
      if (offline) throw new Error('offline');
      if (request.url.includes('/opaque')) {
        return { type: 'opaque', ok: false, status: 0, clone() { return this; } };
      }
      return new Response('network', { status: request.url.includes('/missing') ? 404 : 200 });
    }
  });
  return {
    stores, config,
    setOffline: (value) => offline = value,
    setQuotaExceeded: (value) => quotaExceeded = value,
    async lifecycle(name) {
      const waits = [];
      handlers[name]({ waitUntil: (p) => waits.push(p) });
      await Promise.all(waits);
    },
    async fetch(path, options = {}) {
      let response;
      const waits = [];
      handlers.fetch({
        request: new Request(url(path), options),
        respondWith: (p) => response = p,
        waitUntil: (p) => waits.push(p)
      });
      const result = await response;
      await Promise.all(waits);
      return result;
    }
  };
}

const sources = {
  source: readFileSync('_javascript/pwa/sw.js', 'utf8')
    .replace("import { baseurl } from '../../_config.yml';", "const baseurl = '';"),
  bundle: readFileSync('assets/js/dist/sw.min.js', 'utf8').replace(/^---[\s\S]*?---\s*/, '')
};

for (const [name, source] of Object.entries(sources)) {
  test(`${name}: caches visited pages and preserves precache while evicting concurrent writes`, async () => {
    const w = worker(source);
    await w.lifecycle('install');
    await Promise.all(['/posts/a/', '/posts/b/', '/posts/c/'].map((p) => w.fetch(p)));
    assert.equal(w.stores.get('chirpy-test-runtime').size, 2);
    assert.equal(w.stores.get('chirpy-test').size, 1);
    assert(!w.stores.get('chirpy-test-runtime').has(url('/posts/a/')));
    w.setOffline(true);
    assert.equal(await (await w.fetch('/')).text(), 'precache');
    assert.equal(await (await w.fetch('/posts/c/')).text(), 'network');
  });

  test(`${name}: bypasses excluded requests and does not cache errors`, async () => {
    const w = worker(source);
    for (const path of ['/private/file', '/sw.min.js', '/assets/js/data/swconf.js',
      'https://tracker.test/pixel', 'https://cdn.jsdelivr.net.evil.test/script']) {
      assert.equal(await w.fetch(path), undefined, path);
    }
    assert.equal(await w.fetch('/submit', { method: 'POST' }), undefined);
    assert.equal(await w.fetch('/video', { headers: { range: 'bytes=0-99' } }), undefined);
    assert.equal((await w.fetch('/missing')).status, 404);
    assert.equal(w.stores.size, 0);
    await w.fetch('https://cdn.jsdelivr.net/opaque');
    assert(w.stores.get('chirpy-test-runtime').has('https://cdn.jsdelivr.net/opaque'));
  });

  test(`${name}: cache failures do not break page responses or future writes`, async () => {
    const w = worker(source);
    w.setQuotaExceeded(true);
    assert.equal((await w.fetch('/posts/a/')).status, 200);
    w.setQuotaExceeded(false);
    await w.fetch('/posts/b/');
    assert(w.stores.get('chirpy-test-runtime').has(url('/posts/b/')));
  });

  test(`${name}: activation preserves unrelated caches and purge bypasses cache`, async () => {
    const w = worker(source);
    for (const name of ['unrelated', 'chirpy-old', 'chirpy-old-runtime', 'chirpy-test', 'chirpy-test-runtime']) {
      w.stores.set(name, new Map());
    }
    await w.lifecycle('activate');
    assert.deepEqual([...w.stores.keys()], ['unrelated', 'chirpy-test', 'chirpy-test-runtime']);
    const disabled = worker(source, true);
    disabled.stores.set('unrelated', new Map());
    disabled.stores.set('chirpy-old', new Map());
    await disabled.lifecycle('activate');
    assert.deepEqual([...disabled.stores.keys()], ['unrelated']);
    assert.equal(await disabled.fetch('/'), undefined);
  });
}
