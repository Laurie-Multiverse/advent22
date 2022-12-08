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
  const grid = [];
  for (line of array) {
    const numbers = line.split("");
    grid.push(numbers.map(n => Number(n)));
  }

  // Four separate functions to calculate visibility
  // in each of the 4 directions:
  // top, bottom, left, right
  //
  const topVisible = (row, column) => {
    const value = grid[row][column];
    for (let y = row - 1; y >= 0; y--) {
      if (grid[y][column] >= value) {
        return false;
      }
    }
    return true;
  }

  const bottomVisible = (row, column) => {
    const value = grid[row][column];
    for (let y = row + 1; y < grid.length; y++) {
      if (grid[y][column] >= value) {
        return false;
      }
    }
    return true;
  }

  const leftVisible = (row, column) => {
    const value = grid[row][column];
    for (let x = column - 1; x >= 0; x--) {
      if (grid[row][x] >= value) {
        return false;
      }
    }
    return true;
  }

  const rightVisible = (row, column) => {
    const value = grid[row][column];
    for (let x = column + 1; x < grid[row].length; x++) {
      if (grid[row][x] >= value) {
        return false;
      }
    }
    return true;
  }

  // A tree is visible if it can be seen in any direction
  //
  const visible = (row, column) => 
    (topVisible(row, column) ||
      bottomVisible(row, column) ||
      leftVisible(row, column) ||
      rightVisible(row, column));

  // count all trees which are visible
  //
  let visibleCount = 0;
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (visible(x, y)) {
        visibleCount++;
      }
    }
  }

  console.log(visibleCount);
}

solve();
