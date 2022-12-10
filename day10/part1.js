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
  
  let x = 1;      // starting value of x register
  let cycle = 1;  // in the 1st cycle
  let sum = 0;    // sum of signal strengths
  let n = 0;      // update by this

  for (line of array) {
    // console.log(line);
    if (line == "noop") {
      // use 1 cycle
    } else {
      // line is addx N
      // uses 2 cycles then increases register by N
      [,n] = line.split(" ");
      n = Number(n);

      // if it's a special cycle, collect the value
      if (cycle % 40 == 20) {
        console.log(`cycle: ${cycle} X:${x}`);
        sum += x * cycle;
      }

      cycle++;
      // console.log(n);
    }

    // if it's a special cycle, collect the value
    if (cycle % 40 == 20) {
      console.log(`cycle: ${cycle} X:${x}`);
      sum += x * cycle;
    }

    // if we scheduled an update, do it
    if (n != 0) {
      x += n;
      n = 0;
    }

    // update the cycle
    cycle++;
  }
  console.log(sum);

}

solve();
