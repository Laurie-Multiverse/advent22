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

  // S, H, T start together at (0, 0)
  const start = {x: 0, y: 0};
  let head = start;
  let tail = start;
  
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
  addTail(tail);

  // process each move in the file
  //
  for (line of array) {
    // read move instructions
    let [direction, moves] = line.split(" ");
    moves = Number(moves);

    // move head in "direction" the given number of times,
    //   while the tail follows
    while (moves > 0) {
      head = move(head, direction);
      tail = moveTail(head, tail); 
      addTail(tail);    // add to the set of visited positions
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

  // move tail if necessary
  function moveTail(head, tail) {
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

  // how many unique positions were visited?
  console.log(Object.keys(tails).length);
}

solve();
