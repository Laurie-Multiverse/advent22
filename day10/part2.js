const { readFile } = require("fs").promises;
const path = require("path");

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(path.join(__dirname, "input.txt"), {
    encoding: "utf8",
  });
  const array = contents.split("\r\n");

  let x = 1; // starting value of x register
  let cycle = 1; // in the 1st cycle
  let sum = 0; // sum of signal strengths
  let n = 0; // update by this

  // position indicates the spot that is currently being drawn
  let position = { x: 0, y: 0 };

  const drawPixel = () => {
    if (position.x == x ||
        position.x == x - 1 ||
        position.x == x + 1)
    {
      process.stdout.write("#");
    } else {
      process.stdout.write(".");
    }
  };

  const incrementCycle = (callback) => {
    // if it's a special cycle, collect the value
    if (cycle % 40 == 20) {
      // console.log(`cycle: ${cycle} X:${x}`);
      sum += x * cycle;
    }

    // draw the appropriate pixel
    drawPixel();

    // update the position
    if (++position.x == 40) {
      position.x = 0;
      if (++position.y == 6) {
        position.y = 0;
      }
      console.log();
    }

    if (callback) {
      callback();
    }
    cycle++;
  };

  for (line of array) {
    if (line == "noop") {
      // use 1 cycle
    } else {
      // line is addx N
      // uses 2 cycles then increases register by N
      [, n] = line.split(" ");
      n = Number(n);
      incrementCycle();
    }

    incrementCycle(() => {
      // if we scheduled an update, do it
      if (n != 0) {
        x += n;
        n = 0;
      }
    });
  }
  // console.log(sum);
}

solve();
