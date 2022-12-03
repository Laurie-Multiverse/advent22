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

  // Find the letter three elves have in common
  //
  const common = (elf1, elf2, elf3) => {
    let letters = {};

    // add all the elves' letters into this map exactly once per elf
    addLetters(letters, elf1, 1);
    addLetters(letters, elf2, 2);
    addLetters(letters, elf3, 3);

    for (const key of Object.keys(letters)) {
      if (letters[key].length === 3) {
        return key;
      }
    }

    throw "error: couldn't find letter in common";
  }

  // Add this elf to the map for each letter
  //
  const addLetters = (letters, elf, num) => {
    for (let i = 0; i < elf.length; i++) {
      if (letters[elf[i]]) {
        if (!letters[elf[i]].includes(num)) {
          letters[elf[i]].push(num);
        }
      } else {
        letters[elf[i]]= [num];
      }
    }
  }
    

  // Add up the priorities of the common letters for every 3 elves
  //
  let sum = 0;
  for (let i = 0; i < array.length; i += 3) {
    const letter = common(array[i], array[i+1], array[i+2]);
    sum += priority(letter);
  }
  
  console.log(`The answer is ${sum}`);
}

solve();