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

  // 2 beats 1, 3 beats 2, 1 beats 3
  // to win: if 1, pick 2. if 2, pick 3. if 3, pick 1.
  //    so, pick OPP + 1, and if OPP = 4 then go back to 1
  // to lose: if 1, pick 3. if 2, pick 1. if 3, pick 2.
  let score = 0;

  const opponentPlays = { 'A': 1, 'B': 2, 'C': 3};
  // const mePlays = {'X': 1, 'Y': 2, 'Z': 3};

  // console.log(mePlays['X']);
  // play entire game
  for (let i = 0; i < array.length; i++) {
    let oppIndex = array[i][0];
    let me = array[i][2];
    // console.log(`opp:${oppIndex}, me:${me}`);
    let opp = opponentPlays[oppIndex];
    let move = -1;

    // choose my move based on X, Y, Z:
    if (me == 'X') { // lose
      score += 0;
      move = opp - 1;
      if (move == 0) move = 3;
    } else if (me == 'Y') { // draw
      score += 3;
      move = opp;
    } else if (me == 'Z') { // win
      score += 6;
      move = opp + 1;
      if (move == 4) move = 1;
    }
    // console.log(move, score);
    score += move;

  }
  console.log(score);

  
}

solve();