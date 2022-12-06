const {readFile} = require('fs').promises;
const path = require('path');

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );

  // Does the string contain any repeats?
  // quick and dirty implementation since string has only 4 chars
  const repeats = str => {
    const code0 = str[0].charCodeAt();
    const code1 = str[1].charCodeAt();
    const code2 = str[2].charCodeAt();
    const code3 = str[3].charCodeAt();
    return (
      code0 == code1 || code0 == code2 || code0 == code3 ||
      code1 == code2 || code1 == code3 || code2 == code3);
  }

  // Search for end of 1st string w/o repeats
  //
  for (let i = 4; i < contents.length; i++) {
    const last4 = contents.slice(i - 4, i);
    if (!repeats(last4)) {
      console.log(`The result is ${i}: ${last4}`);
      return;
    }
  }
  console.log("FAILED");
}

solve();