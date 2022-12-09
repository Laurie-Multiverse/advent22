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
  
  // track all tail positions in an object called tails
  //   basically this is a set with no repeats
  //   but not the JS Set because of object equality
  const tails = {};
  function addTail({x, y}) {
    const key = 'X' + x + 'Y' + y;
    if (!tails[key]) {
      tails[key] = {x, y};
    }
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
      knots[0] = move(knots[0], direction);
      for (let i = 1; i <= 9; i++) {
        // move next knot to follow previous knot
        knots[i] = moveKnot(knots[i - 1], knots[i]);
      }
      addTail(knots[9]);      // add to the set of visited positions
      moves--;
    }
  }

  // move one step in a direction
  function move(pos, direction) {
    if (direction == "R") {
      return {x: pos.x + 1, y: pos.y};
    } else if (direction == "L") {
      return {x: pos.x - 1, y: pos.y};
    } else if (direction == "U") {
      return {x: pos.x, y: pos.y + 1};
    } else if (direction == "D") {
      return {x: pos.x, y: pos.y - 1};
    } else {
      console.log("ERROR");
    }
  }

  // move next if necessary
  function moveKnot(head, tail) {
    let newx = tail.x;
    let newy = tail.y;
    if (head.x == tail.x) {
      // same row
      if (head.y > tail.y + 1) {
        newy++;
      } else if (head.y < tail.y - 1) {
        newy--;
      }
    } else if (head.y == tail.y) {
      // same column
      if (head.x > tail.x + 1) {
        newx++;
      } else if (head.x < tail.x - 1) {
        newx--;
      }
    } else {
      // diagonal
      if (Math.abs(head.x-tail.x) + Math.abs(head.y-tail.y) > 2) {
        if (head.x > tail.x) {
          newx++;
        } else {
          newx--;
        }
        if (head.y > tail.y) {
          newy++;
        } else {
          newy--;
        }
      }
    }
    return {x: newx, y: newy};
  }

  console.log(Object.keys(tails).length);
}

solve();
