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

  let score = 0;

  const opponentPlays = { 'A': 1, 'B': 2, 'C': 3};
  const mePlays = {'X': 1, 'Y': 2, 'Z': 3};

  // console.log(mePlays['X']);
  // play entire game
  for (let i = 0; i < array.length; i++) {
    oppIndex = array[i][0];
    meIndex = array[i][2];
    // console.log(`opp:${oppIndex}, me:${meIndex}`);
    let opp = opponentPlays[oppIndex];
    let mine = mePlays[meIndex];
    // console.log(`    opp:${opp}, me:${mine}`);

    // add the shape you selected
    score += mine;

    // add the outcome
    if (opp === mine) {
      score += 3;
    } else if (
      (opp == 1 && mine == 2) ||
      (opp == 2 && mine == 3) ||
      (opp == 3 && mine == 1)) {
        score += 6;
    }

  }
  console.log(score);

  
}

solve();