const {readFile} = require('fs').promises;
const path = require('path');

async function solve() {
  // read file. 
  //  given input.txt in the current directory
  //  result is an array of strings, 1 per line, no newline chars
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\r\n');

  // cumulatively calculate overall score
  let score = 0;

  const opponentPlays = { 'A': 1, 'B': 2, 'C': 3};
  const meScore = {'X': 0, 'Y': 3, 'Z': 6};

  // console.log(mePlays['X']);
  // play entire game
  for (let i = 0; i < array.length; i++) {
    let oppIndex = array[i][0];         // 'A', 'B', or 'C'
    let me = array[i][2];               // 'X', 'Y', or 'Z'
    let opp = opponentPlays[oppIndex];  // 1, 2, or 3

    // add lose, draw or win score based on X, Y, Z
    score += meScore[me];

    // choose my move based on X, Y, Z:
    let move = -1;
    switch(me) {
      case 'X':           // lose. 1->3, 2->1, 3->2.
        move = opp - 1;
        if (move == 0) move = 3;
        break;
      case 'Y':           // draw
        move = opp;
        break;
      case 'Z':           // win. 1->2, 2->3, 3->1.
        move = opp % 3 + 1;
        break;
      default:
        console.log("ERROR IN DATA");
        break;
    }
    score += move;

  }
  console.log(score);  
}

solve();