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

  // parse file into list of paths
  //  rock = [path, path, ...]
  const rock = [];
  let lowestRock = 0;
  for (line of array) {
    readPath(line);
  }

  // add an infinite floor for part2
  rock.push({
    start: {x: -10000, y: lowestRock + 2},
    end: {x: 100000, y: lowestRock + 2}
  });

  // parse a line such as '498,4 -> 498,6 -> 496,6'
  //  and store it as paths in rock
  //  each path is {start:{x,y} end:{x,y}}
  function readPath(line) {
    const points = line.split(" -> ");
    let lastPoint = null;
    for (const point of points) {
      const [x, y] = point.split(",");
      const thisPoint = { x: Number(x), y: Number(y) };
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
  //  sand = {'100': [1, 2, 3, 4], '102': [1, 2, 3, 4], ...} where the keys are y-values
  const sand = {};
  let grainCount = 0;
  function dropAllSand() {
    let moving = true;
    while (moving) {
      moving = dropSand();
    }
  }



  // drop one piece of sand until it stops
  //  returns false if the sand didn't move anywhere (still at 500, 0)
  function dropSand() {
    let pos = { x: 500, y: 0 };
    let moved = false;

    // move down as far as possible
    while (pos) {
      const y = pos.y + 1;
      let nextPos = moveTo({ x: pos.x, y });                // try straight down
      if (!nextPos) nextPos = moveTo({ x: pos.x - 1, y });  // try down-and-left
      if (!nextPos) nextPos = moveTo({ x: pos.x + 1, y });  // try down-and-right
      if (!nextPos) break;                                  // at rest

      pos = nextPos;                                        // try to move some more
      moved = true;
    }

    addToSandPile(pos);
    return moved;
  }

  // try to move to a position; returns new pos (or false if couldn't move)
  function moveTo(pos) {
    if (inRock(pos) || inSand(pos)) return false;
    else return pos;
  }

  // add a new piece of sand to the pile at pos {x, y}
  function addToSandPile(pos) {
    const key = pos.y + "";
    if (!sand[key]) sand[key] = [];     // create array if this is our first point at this level
    sand[key].push(pos.x);              // add to y-array
    grainCount++;
  }


  // is position in rock?
  // does given position lie in the rock?
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

  // is x2 between x1 and x3, inclusive?
  function between(x1, x2, x3) {
    return (x1 <= x2 && x2 <= x3) || (x1 >= x2 && x2 >= x3);
  }

  // does given position lie in the sand?
  function inSand(pos) {
    const key = pos.y + "";
    if (!sand[key]) return false;           // no sand at this level
    return sand[key].includes(pos.x);       // no sand at this position
  }


  // drop all the sand
  dropAllSand();
  
  console.log(`grains of sand: ${grainCount}`); // 367, 368 too low
}

solve();
