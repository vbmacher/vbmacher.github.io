w = 500;
h = 200;

var svg = d3.select("#turingm").append("svg").attr("width", w).attr("height", h);

function mkHead(vis) {
    headH = 60;
    headW = 60;

    headGroup = vis.append("svg:g").attr("transform", "translate(" + ((w - headW) / 2) + "," + (h - headH - 10) + ")");
    headGroup.append("rect").attr("fill", "white").attr("y", 0).attr("height", headH).attr("width", headW).attr("x", 0)
    headGroup.append("rect").attr("fill", "white").attr("y", -20).attr("height", 20).attr("width", 10).attr("x", (headW - 10) / 2);

    headGroup.append('path')
        .attr("fill", "white")
        .attr('d', function (d) {
            var x = headW / 2, y = -25;
            return 'M ' + x + ' ' + y + ' l 8 8 l -16 0 z';
        });

    return headGroup.append("svg:text").attr("fill", "black").attr("x", headW / 2 - 8).attr("y", headH / 2 + 10)
        .attr("font-family", "mono").attr("font-size","25px").attr("font-weight", "bold").text("");
}

function mkTape(vis) {
    var tape = [], nodes = 11;
    var itemH = 25, itemW = 25, deltax = itemW + 2;
    var y = h / 2 - itemW, x = (w - nodes * deltax) / 2;

    tapeGroup = vis.append("svg:g").attr("transform", "translate(" + x + "," + y + ")");
    for (var j = 0; j < nodes; j++) {
        tapeGroup.append("rect").attr("fill", "white").attr("y", 0).attr("height", itemH).attr("width", itemW).attr("x", j * deltax);
        text = tapeGroup.append("svg:text").attr("fill", "black").attr("x", 5 + j * deltax).attr("y", 18)
            .attr("font-family", "mono").text("")

        tape.push(text);
    }
    return tape.reverse();
}

var head = mkHead(svg);
var tape = mkTape(svg);

var tm = {
    "b": ["", "0", "R", "c"],
    "c": ["", "", "R", "e"],
    "e": ["", "1", "R", "f"],
    "f": ["", "", "R", "b"]
};

head.text("b")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

async function step() {
    state = head.text();
    current = Math.floor(tape.length / 2)
    symbol = tape[current].text();

    op = tm[state];
    if (symbol == op[0]) tape[current].text(op[1])

    await sleep(200)

    if (op[2] == "L") {
        for (i = 1; i < tape.length; i++) tape[i - 1].text(tape[i].text())
    } else if (op[2] == "R") {
        for (i = tape.length - 2; i >= 0; i--) tape[i + 1].text(tape[i].text())
    }
    head.text(op[3])
}

function reset() {
    head.text("b")
    for (i = 0; i < tape.length; i++) tape[i].text("")
}