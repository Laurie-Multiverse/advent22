const {readFile} = require('fs').promises;
const path = require('path');

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\r\n');

  // S, all 10 knots start together at (0, 0)
  const start = {x: 0, y: 0};
  const knots = [];         // all 10 knot positions S, 1, 2, ... 9
  for (let i = 0; i <= 9; i++) {
    knots[i] = start;
  }
  
  // e.g. {3, -10} => 'X3Y-10'
  const makeKey = (x, y) => 'X' + x + 'Y' + y;

  // track all tail positions in an object called tails
  //   basically this is a set with no repeats
  //   but not the JS Set because of object equality
  const tails = {};
  function addTail({x, y}) {
    const key = makeKey(x, y);
    if (!tails[key]) {
      tails[key] = {x, y};
    }
  }

  // Map of moves for head depending on input
  //
  const headDelta = {
    'R': {x: 1, y: 0},
    'L': {x:-1, y: 0},
    'U': {x: 0, y: 1},
    'D': {x: 0, y:-1}
  };

  // move one step in a direction
  //  input: pos = current position, direction = R/L/U/D
  //  output: new pos
  const moveHead = (pos, direction) => ({
      x: pos.x + headDelta[direction].x, 
      y: pos.y + headDelta[direction].y
    });

  // move the tail to follow the head
  //  input: head = position to follow, tail = current position
  //  output: new tail positon
  // move tail if necessary
  const moveKnot = (head, tail) => {
    let dx = head.x - tail.x;
    let dy = head.y - tail.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    if (adx <= 1 && ady <= 1) { // touching
      dx = 0;
      dy = 0;
    } else {    // not touching, move 1 step in each direction necessary
      if (dx) {
        dx /= adx;
      }
      if (dy) {
        dy /= ady;
      } 
    }
    return {x: tail.x + dx, y: tail.y + dy};
  }

  // only track the unique positions of the final knot
  addTail(knots[9]);

  // process each move in the file
  //
  for (line of array) {
    // read move instructions
    let [direction, moves] = line.split(" ");
    moves = Number(moves);
    
    // move head in "direction" the given number of times,
    //   while each knot follows
    while (moves > 0) {
      // move 1st knot in direction
      knots[0] = moveHead(knots[0], direction);
      for (let i = 1; i <= 9; i++) {
        // move next knot to follow previous knot
        knots[i] = moveKnot(knots[i - 1], knots[i]);
      }
      addTail(knots[9]);      // add to the set of visited positions
      moves--;
    }
  }

  console.log(Object.keys(tails).length);
}

solve();
