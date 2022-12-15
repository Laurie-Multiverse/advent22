const { readFile } = require("fs").promises;
const path = require("path");

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, "input.txt"), {
    encoding: "utf8",
  });
  const array = contents.split("\r\n");

  // parse file into list of paths "rock"
  const rock = [];
  let lowestRock = 0;
  for (line of array) {
    readPath(line);
  }

  let DEBUG = false;
  // for (let i = 0; i < rock.length; i++) {
  //   if (between(93, rock[i].start.y, 93)) {
  //     console.log(rock[i]);
  //   }
  // }
  // console.log("\nrock\n", rock);

  // parse a line such as '498,4 -> 498,6 -> 496,6'
  //  and store it as paths in rock
  //  path is {start:{x,y} end:{x,y}}
  function readPath(line) {
    const points = line.split(" -> ");
    let lastPoint = null;
    for (const point of points) {
      const [x, y] = point.split(",");
      const thisPoint = { x, y };
      if (lastPoint) {
        if (thisPoint.y > lowestRock) {
          lowestRock = thisPoint.y; // save to know when we are done
        }
        rock.push({ start: lastPoint, end: thisPoint });
      }
      lastPoint = thisPoint;
    }
  }

  // drop sand one piece at a time until it stops
  //  each grain of sand is stored in an object with keys y to lists x
  const sand = {};
  let grainCount = 0;
  function dropAllSand() {
    let moving = true;
    while (moving) {
      moving = dropSand();
    }
  }

  // drop one piece of sand until it stops
  function dropSand() {
    let pos = { x: 500, y: 0 };
    // console.log("dropping grain of sand...");

    // move down as far as possible
    while (pos) {
      // if we have dropped below the rock, we're done
      if (pos.y > lowestRock) {
        return false;
      }
      // console.log("\t", pos);
      // move down, if not then left diagonally, if not then right diagonally
      const y = pos.y + 1;
      let nextPos = moveTo({ x: pos.x, y });
      if (!nextPos) {
        nextPos = moveTo({ x: pos.x - 1, y });
      }
      if (!nextPos) {
        nextPos = moveTo({ x: pos.x + 1, y });
      }
      if (!nextPos) {
        if (DEBUG) console.log("breaking after", pos);
        break;
      }
      if (DEBUG) console.log("continuing at", nextPos);
      pos = nextPos;
    }
    if (pos.x == 500 && pos.y == 0) {
      return false;
    }
    if (DEBUG) console.log("add to Sandpile", pos);
    addToSandPile(pos);
    return true;
  }

  // try to move to a position; returns new pos or false
  function moveTo(pos) {
    if (inRock(pos) || inSand(pos)) {
      return false;
    }
    return pos;
  }

  // add a new piece of sand to the pile at pos {x, y}
  //  sand pile is an object with y values as keys to lists of x values
  function addToSandPile(pos) {
    // console.log("addtoSandPile", pos);
    const key = pos.y + "";
    if (!sand[key]) {
      sand[key] = [];
    }
    sand[key].push(pos.x);
    grainCount++;
    // console.log(sand);
  }

  // is position in rock?
  function inRock(pos) {
    for (const path of rock) {
      if (
        between(path.start.x, pos.x, path.end.x) &&
        between(path.start.y, pos.y, path.end.y)
      ) {
        return true;
      }
    }
    return false;
  }

  function between(x1, x2, x3) {
    return (x1 <= x2 && x2 <= x3) || (x1 >= x2 && x2 >= x3);
  }

  // is position in sand?
  function inSand(pos) {
    const key = pos.y + "";
    if (!sand[key]) {
      // if (DEBUG) console.log('inSand', pos, false);
      return false;
    }
    const included = sand[key].includes(pos.x);
    // if (DEBUG) console.log('inSand', pos, included);
    return included;
  }

  let lowx = 10000;
  let highx = -1;
  function printGrid() {
    // find bounds of x
    for (let path of rock) {
      checkBounds(path.start.x);
      checkBounds(path.end.x);
    }
    for (key of Object.keys(sand)) {
      for (x of sand[key]) {
        checkBounds(x);
      }
    }
    // print top rows
    process.stdout.write("\n    ");

    for (let x = lowx; x <= highx; x++) {
      if (x == lowx || x == highx || x % 5 == 0) {
        process.stdout.write(x > 100 ? Math.trunc(x / 100).toString() : " ");
      } else {
        process.stdout.write(" ");
      }
    }
    process.stdout.write("\n    ");
    for (let x = lowx; x <= highx; x++) {
      if (x == lowx || x == highx || x % 5 == 0) {
        process.stdout.write(
          x > 10 ? Math.trunc((x % 100) / 10).toString() : " "
        );
      } else {
        process.stdout.write(" ");
      }
    }
    process.stdout.write("\n    ");
    for (let x = lowx; x <= highx; x++) {
      if (x == lowx || x == highx || x % 5 == 0) {
        process.stdout.write((x % 10).toString());
      } else {
        process.stdout.write(" ");
      }
    }
    process.stdout.write("\n");

    // iterate over each row, slow but who cares
    for (let y = 0; y <= lowestRock; y++) {
      process.stdout.write(`${y.toString().padStart(2, " ")}: `);
      for (let x = lowx; x <= highx; x++) {
        if (x == 500 && y == 0) {
          process.stdout.write("+");
        } else if (inRock({ x, y })) {
          process.stdout.write("#");
        } else if (inSand({ x, y })) {
          process.stdout.write("o");
        } else {
          process.stdout.write(".");
        }
      }
      console.log();
    }
  }
  // print out the grid for debugging purposes
  function checkBounds(x) {
    if (x < lowx) lowx = x;
    if (x > highx) highx = x;
  }

  // drop all the sand
  dropAllSand();
  // function printInRock(x, y) {
  //   console.log(x, y, inRock({x, y}))
  // }
  // printInRock(465, 90);
  // printInRock(471, 90);
  // printInRock(468, 93);
  // printInRock(465, 91);

  // print a map like example
  printGrid();

  console.log(`grains of sand: ${grainCount}`); // 367, 368 too low
}

solve();
