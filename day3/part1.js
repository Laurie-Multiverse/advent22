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

  // Calculate priority of a letter
  //
  const ascii_a = 'a'.charCodeAt();
  const ascii_A = 'A'.charCodeAt();
  const priority = letter => {
    const ascii = letter.charCodeAt();
    if (ascii > ascii_a) {
      return ascii - ascii_a + 1;
    } else {
      return ascii - ascii_A + 27;
    }
  }

  // Find the letter two strings have in common
  //
  const common = (left, right) => {
    let items = {};

    for (let j = 0; j < left.length; j++) {
      // was letter already found in the other string?
      if (items[left[j]] === 'R') {
        return left[j];
      } else if (items[right[j]] === 'L') {
        return right[j];
      } else if (left[j] === right[j]) {
        return left[j];
      }

      // if not, place the letter in the dictionary
      items[left[j]] = 'L';
      items[right[j]] = 'R';
    }
    
    // never found a common letter
    console.log("ERROR : could not find common letter");
    console.log(items);
  }

  // Find the letters that appear in both compartments
  //
  let sum = 0;
  console.log(`${array.length} total lines`);
  for (let i = 0; i < array.length; i++) {
    const string = array[i];

    // find the common letter and add its priority
    //
    const left = string.substring(0, string.length / 2);
    const right = string.substring(string.length / 2); 
    const letter = common(left, right);
    sum += priority(letter);
  }
  
  console.log(`The answer is ${sum}`);
}

solve();