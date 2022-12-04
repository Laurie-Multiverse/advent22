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

  // accumulate the total number that are completely contained
  //
  let sum = 0;

  for (line of array) {
    const [min1, max1, min2, max2] = line.split(/[,-]+/).map(n => Number(n));
    if (rangeContains(min1, max1, min2, max2)) {
      sum++;
    }
  }
  
  console.log(`The answer is ${sum}`);
}

const rangeContains = (min1, max1, min2, max2) => 
  (
    (min1 <= min2 && max2 <= max1) ||
    (min2 <= min1 && max1 <= max2)
  );

solve();