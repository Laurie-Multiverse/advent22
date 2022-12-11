const {readFile} = require('fs').promises;
const path = require('path');
const { inspect } = require('util');

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\r\n');

  // each monkey has:
  //   items:[#, #, ...]
  //   inspectCount: #
  //   operation: '+' or '*'
  //   operand: # or 'old'
  //   factor: # to divde by
  //   ifTrue: monkey #
  //   ifFalse: monkey #
  const monkeys = [];

  const getOp = op => (op == 'old' ? item : Number(op));

  // take a turn
  const turn = monkey => {
    // inspect and throw each item
    const numItems = monkey.items.length;
    for (let i = 0; i < numItems; i++) {
      item = monkey.items[i];
      // console.log(` item has worry level ${item}`);
      // adjust worry level

      const op = getOp(monkey.operand);
      if (monkey.operation == '*') {
        item *= op;
        // console.log(item, '*', op);
      } else if (monkey.operation == '+') {
        item += op;
        // console.log(item, '+', op);
      } else {
        error("unknown operation");
      }
      // console.log(` worry level changed to ${item}`)
      // inspect item
      monkey.inspectCount++;

      // divisibility test
      let newMonkeyIndex;
      if (item % monkey.factor == 0) {
        // console.log(`  divisible by ${monkey.factor}`)
        newMonkeyIndex = monkey.ifTrue;
      } else {
        // console.log(`  not divisible by ${monkey.factor}`)
        newMonkeyIndex = monkey.ifFalse;
      }
      // console.log(`  thrown to monkey ${newMonkeyIndex}`);
      item %= magic;
      monkeys[newMonkeyIndex].items.push(item);
    }
    // remove the items we processed
    monkey.items.splice(0, numItems);
  }

  // execute a round
  const round = () => {
    for (let i = 0; i < monkeys.length; i++) {
      turn(monkeys[i]);
    }
  }

  let magic = 1;

  // read the notes on the monkeys
  for (let i = 0; i < array.length; i++) {
    // Parse the monkey
    // Monkey #
    i++; 

    // Starting items: n1, n2, ...
    const ITEMS_INDEX = "  Starting items: ".length;
    const itemList = array[i++].slice(ITEMS_INDEX);
    const items = itemList.split(", ").map(n => Number(n));

    // Operation: new = old * 6
    const OPS_INDEX = "  Operation: new = old ".length;
    const [operation, operand] = array[i++].slice(OPS_INDEX).split(" ");

    // Test: divisible by n
    const FACTOR_INDEX = "  Test: divisible by ".length;
    const factor = Number(array[i++].slice(FACTOR_INDEX));
    magic *= factor;

    // if true: throw to monkey n
    const TRUE_INDEX = "    If true: throw to monkey ".length;
    const ifTrue = Number(array[i++].slice(TRUE_INDEX));

    // if false: throw to monkey n
    const FALSE_INDEX = "    If false: throw to monkey ".length;
    const ifFalse = Number(array[i++].slice(FALSE_INDEX));

    // add new monkey record
    const monkey = {
      items, 
      inspectCount: 0,
      operation, 
      operand, 
      factor, 
      ifTrue, 
      ifFalse};
    monkeys.push(monkey);
  }

  const logInspectCounts = () => {
    for (let i = 0; i < monkeys.length; i++) {
      console.log(`monkey #${i} inspected items ${monkeys[i].inspectCount} times.`)
    }
    console.log();
  }

  // process the items for given number of  rounds
  for (let i = 0; i < 10000; i++) {
    monkeys.map(monkey => turn(monkey));
  }

  console.log("***** Final Inspect Counts *****");
  const inspectCounts = [];
  for (let i = 0; i < monkeys.length; i++) {
    console.log(`monkey #${i} inspected items ${monkeys[i].inspectCount} times.`)
    inspectCounts.push(monkeys[i].inspectCount);
  }
  inspectCounts.sort((a, b) => b - a);
  console.log(`\n${inspectCounts[0]} * ${inspectCounts[1]} = ${inspectCounts[0] * inspectCounts[1]}`);

  //134482 * 134479 = 18085004878
}

solve();
