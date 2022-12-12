const {readFile} = require('fs').promises;
const path = require('path');
const { stdout } = require('process');

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\r\n');

  // get letter value to store in matrix
  const getVal = (letter) => {
    if (letter == 'S') {
      return 'a'.charCodeAt() - 1;
    } else if (letter == 'E') {
      return 'z'.charCodeAt() + 1;
    } else {
      return letter.charCodeAt();
    }
  }

  // load heightmap
  let S, E;
  const hmap = [];
  for (line of array) {
    const row = [];
    for (let col = 0; col < line.length; col++) {
      const letter = line.slice(col, col + 1);
      row.push({letter, value: getVal(letter)});
      if (letter == 'S') {
        S = {row:hmap.length, col};
      } else if (letter == 'E') {
        E = {row:hmap.length, col};
      }
    }
    hmap.push(row);
  }

  // helper functions
  const isE = pos => (pos.row == E.row && pos.col == E.col);
  const makeKey = (pos) => 'R' + pos.row + 'C' + pos.col;
  const decodeKey = (key) => {
    const cIndex = key.indexOf('C');
    const row = Number(key.slice(1, cIndex));
    const col = Number(key.slice(cIndex + 1));
    return {row, col};
  }

  // store visited
  let visited = new Set();
  const setVisited = (node) => visited.add(makeKey(node));
  const hasVisited = (node) => visited.has(makeKey(node));

  // add the reachable position to the set
  const addReachable = (pos, set) => {
    if (isE(pos)) {           // if we got here, then remember the path and exit
      if (steps < minPath) {
        minPath = steps;
      }
      throw 'done';
    }
    set.add(makeKey(pos));
    setVisited(pos);
  }
  const canGo = (node, pos) => 
    (hmap[node.row][node.col].value + 1 >= hmap[pos.row][pos.col].value);

  // Try to reach position in one step
  //    If it succeeds, add it to the set
  const tryToReach = (node, pos, set) => {
    // can't move off grid, too high, or into existing position
    if (pos.row != -1 &&
        pos.row != hmap.length &&
        pos.col != -1 &&
        pos.col != hmap[pos.row].length &&
        canGo(node, pos) &&
        !set.has(makeKey(node)) &&
        !hasVisited(pos)) {
          addReachable(pos, set);  
    }
  }

  // Add all the nodes we can reach in one step to the set
  const addReachableNodes = (key, set) => {
    const node = decodeKey(key);
    const up = {row: node.row - 1, col: node.col};
    const right = {row: node.row, col: node.col + 1};
    const down = {row: node.row + 1, col: node.col};
    const left = {row: node.row, col: node.col - 1};
    tryToReach(node, up, set);
    tryToReach(node, right, set);
    tryToReach(node, down, set);
    tryToReach(node, left, set);
  }

  // Find all paths given a starting position 
  let steps = 0;
  let minPath = 1000000;
  const findAllPaths = (start) => {
    // start with the one node we are at
    let reachableNow = new Set();
    addReachable(start, reachableNow);

    while (true) {      // continue until Done exception
      steps++;
      // calculate the nodes reachable in one step from the current set of nodes
      const reachableNext = new Set();
      try {
        for (key of reachableNow) {
          addReachableNodes(key, reachableNext);
        }
      } catch (error) {
        // console.log(`Found path of length ${steps}`);
        break;
      }

      // Did we get to a dead end?
      if (reachableNext.size == 0) {
        break;
      }

      // go on to the next set of nodes
      reachableNow = reachableNext;
    }
  }

  // do it!
  // try to find all paths FROM ANY SQUARE MARKED 'a'
  for (let row = 0; row < hmap.length; row++) {
    for (let col = 0; col < hmap[row].length; col++) {
      if (hmap[row][col].letter == 'a') {
        findAllPaths({row, col});
        steps = 0;
        visited = new Set();
      }
    }
  }
  console.log(minPath);

}

solve();
