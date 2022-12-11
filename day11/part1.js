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

  // each monkey has:
  //   items:[#, #, ...]
  //   inspectCount: #
  //   operation: '+' or '*'
  //   operand: # or 'old'
  //   factor: # to divde by
  //   ifTrue: monkey #
  //   ifFalse: monkey #
  const monkeys = [];

  // helper functions

  const getOp = op => (op == 'old' ? item : Number(op));

  const adjustWorry = (monkey, item) => {
    const op = getOp(monkey.operand);
    if (monkey.operation == '*') {
      return item * op;
    } else if (monkey.operation == '+') {
      return item + op;
    } else {
      console.error("unknown operation");
    } 
  }

  const throwItem = (monkey, item) => {
    let newMonkeyIndex;
    if (item % monkey.factor == 0) {
      newMonkeyIndex = monkey.ifTrue;
    } else {
      newMonkeyIndex = monkey.ifFalse;
    }
    monkeys[newMonkeyIndex].items.push(item);
  }

  const turn = monkey => {
    const numItems = monkey.items.length;
    for (let i = 0; i < numItems; i++) {
      item = monkey.items[i];            // get worry level
      item = adjustWorry(monkey, item);
      monkey.inspectCount++;
      item = Math.floor(item / 3);       // divide worry level
      throwItem(monkey, item);
    }
    monkey.items.splice(0, numItems);    // remove the items we processed
  }

  // initial parse: read the notes on the monkeys
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

  // process the items for given number of  rounds
  for (let i = 0; i < 20; i++) {
    monkeys.map(monkey => turn(monkey));
  }

  // log out the results
  console.log("\n ***** Final Inspect Counts *****");
  const inspectCounts = [];
  for (let i = 0; i < monkeys.length; i++) {
    console.log(`monkey #${i} inspected items ${monkeys[i].inspectCount} times.`)
    inspectCounts.push(monkeys[i].inspectCount);
  }
  inspectCounts.sort((a, b) => b - a);
  console.log(`\n${inspectCounts[0]} * ${inspectCounts[1]} = ${inspectCounts[0] * inspectCounts[1]}`);

  // 345 * 347 = 119715
  
}

solve();
