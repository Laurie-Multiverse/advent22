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

  // crates[i] is stack #i
  // first crate in crates[i] is on top of the stack
  const crates = [
    [],
    ['W', 'B', 'G', 'Z', 'R', 'D', 'C', 'V'],
    ['V', 'T', 'S', 'B', 'C', 'F', 'W', 'G' ],
    ['W', 'N', 'S', 'B', 'C'],
    ['P', 'C', 'V', 'J', 'N', 'M', 'G', 'Q'],
    ['B', 'H', 'D', 'F', 'L', 'S', 'T'],
    ['N', 'M', 'W', 'T', 'V', 'J'],
    ['G', 'T', 'S', 'C', 'L', 'F', 'P'],
    ['Z', 'D', 'B'],
    ['W', 'Z', 'N', 'M']
  ];

  // read and process the commands
  //
  for (line of array) {
    const [,numCrates,,fromStack,,toStack] = line.split(' ');
    for (let i = 0; i < numCrates; i++) {
      const crate = crates[fromStack].shift();
      crates[toStack].unshift(crate);
    }
  }

  // log out the top of each stack
  let result = "";
  for (stack of crates) {
    if (stack[0]) {
      result += stack[0];
    }
  }
  console.log(`The result is ${result}`);

}

solve();