const {readFile} = require('fs').promises;
const path = require('path');

async function solve() {
  // read file
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\n');

  // preview data
  // for (let i = 0; i < 15; i++) {
  //   console.log(array[i]);
  // }

  // find elf with total calories
  let maxCalories = -1;
  let totalCalories = 0;
  for (let i = 0; i < array.length; i++) {
    // reset to a new elf
    if (array[i].length == 1) {
      if (totalCalories > maxCalories) {
        maxCalories = totalCalories;
        console.log("NEW MAX: " + maxCalories);
      }
      totalCalories = 0;
      continue;
    }

    // add to current elf's calories
    totalCalories += Number(array[i]);
  }

  // in case the last elf had the most
  if (totalCalories > maxCalories) {
    maxCalories = totalCalories;
  }
  console.log(maxCalories);
}

solve();