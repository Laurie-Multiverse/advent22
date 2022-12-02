const {readFileSync} = require('fs');

function solve() {
  // read file
  const contents = readFileSync('input.txt', 'utf-8');
  const array = contents.split('\n');

  //preview data
  for (let i = 0; i < 15; i++) {
    console.log(array[i]);
  }

  // add total calories to a sorted array
  let elves = [];
  let totalCalories = 0;
  for (let i = 0; i < array.length; i++) {
    // reset to a new elf
    if (array[i].length == 1) {
      elves.push(totalCalories);
      totalCalories = 0;
      continue;
    }

    // add to current elf's calories
    totalCalories += Number(array[i]);
  }

  // in case the last elf had the most
  elves.push(totalCalories);
  elves.sort((a, b) => b - a);
  // console.log(elves);

  const answer = elves[0] + elves[1] + elves[2];
  console.log(answer);


}

solve();