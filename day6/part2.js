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
  // Recursive implementation since string has 14 chars
  const repeats = str => {
    if (str.length < 2) {
      // only 0-1 chars left
      return false;
    } else {
      // check 1st char against rest of string to find a repeat
      for (let i = 1; i < str.length; i++) {
        if (str[0] == str[i]) {
          return true;
        }
      }
      // 1st char did not repeat, check rest of string
      return repeats(str.slice(1));
    }
  }

  // Search for end of 1st string w/o repeats
  //
  for (let i = 14; i < contents.length; i++) {
    const last14 = contents.slice(i - 14, i);
    if (!repeats(last14)) {
      console.log(`The result is ${i}: ${last14}`);
      return;
    }
  }

  // shouldn't get here
  console.log("FAILED");
}

solve();