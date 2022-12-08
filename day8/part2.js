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

  // Load values into grid
  //
  const grid = [];
  for (line of array) {
    const numbers = line.split("");
    grid.push(numbers.map(n => Number(n)));
  }

  // Four separate functions to calculate the scenic score
  // in each of the four directions: top, bottom, left, right
  //
  const topScenic = (row, column) => {
    const value = grid[row][column];
    let view = 0;
    for (let y = row - 1; y >= 0; y--) {
      view++;
      if (grid[y][column] >= value) {
        return view;
      }
    }
    return view;
  }

  const bottomScenic = (row, column) => {
    const value = grid[row][column];
    let view = 0;
    for (let y = row + 1; y < grid.length; y++) {
      view++;
      if (grid[y][column] >= value) {
        return view;
      }
    }
    return view;
  }

  const leftScenic = (row, column) => {
    const value = grid[row][column];
    let view = 0;
    for (let x = column - 1; x >= 0; x--) {
      view++;
      if (grid[row][x] >= value) {
        return view;
      }
    }
    return view;
  }

  const rightScenic = (row, column) => {
    const value = grid[row][column];
    let view = 0;
    for (let x = column + 1; x < grid[row].length; x++) {
      view++;
      if (grid[row][x] >= value) {
        return view;
      }
    }
    return view;
  }

  // the total scenic score is the product of all 4
  //
  const scenic = (row, column) => 
    (topScenic(row, column) *
      bottomScenic(row, column) *
      leftScenic(row, column) *
      rightScenic(row, column));

  // calculate most scenic of all the trees
  //
  let mostScenic = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      const scenicScore = scenic(x, y);
      if (scenicScore > mostScenic) {
        mostScenic = scenicScore;
      }
    }
  }

  console.log(mostScenic);
}

solve();
