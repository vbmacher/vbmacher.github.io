// node install -g asciitree

var draw_tree = require('asciitree');


var tree = [
  'Ops', ['Ops', 'Num 5', 'Mul (Num 20)'],
  'Div (Num 10)'
];

console.log(draw_tree(tree));
