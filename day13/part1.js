const {readFile} = require('fs').promises;
const { getPackedSettings } = require('http2');
const { parse } = require('path');
const path = require('path');
const { stdout } = require('process');

async function solve() {
  // read file into an array of lines
  //
  const contents = await readFile(
    path.join(__dirname, 'input.txt'),
    { encoding: 'utf8' }
    );
  const array = contents.split('\r\n');

  // Collect the sum of all the pairs that are "in order"
  //
  let sum = 0;
  let pair = 1;
  for (let i = 0; i < array.length; i+=3) {
    const left = parse(array[i]);
    const right = parse(array[i + 1]);

    if (compareArrays(left, right) < 0) {
      sum += pair;
    }
    pair++;
  }
  console.log(`The sum is ${sum}`); // 6240

  // Parsing functions
  //

  // read the string and return a "packet" (tree of arrays and nums)
  function parse(str) {
    const [packet] = parseElement(str);
    return packet;
  }

  // read a string which is a single element (array or num)
  //    and return [packet, length of string consumed]
  function parseElement(str) {
    let element;
    if (str[0] == '[') {      // nested list
      element = parseList(str);
    } else {                  // number
      if (parseInt(str[1]) != NaN) {
        element = [parseInt(str), 1];
      } else {     // account for 2 digits
        element = [parseInt(str), 2];
      }
    }
    return element;
  }

  // read the string which is an array of elements
  //    and return [packet, length of string comsumed]
  function parseList(str) {
    const packet = [];
    let index = 1;
    while (index < str.length) {
      if (str[index] == '[') {        // beginning of a sub-list
        const [listPacket, length] = parseList(str.slice(index));
        packet.push(listPacket);
        index += length;
      } else if (str[index] == ']') { // end of this main list
        index++;
        break;
      } else if (str[index] == ',') {
        // ignore it
        index++;
      } else {  // add a number to the current packet
        const [numPacket, length] = parseElement(str.slice(index));
        packet.push(numPacket);
        index += length;
      }
    }
    return [packet, index];
  }

  // compares "matching" elements in each array
  //  Left < Right => negative
  //  Left = Right => 0
  //  Left > Right => positive
  function compareArrays(left, right) {
    for (let i = 0; i < left.length; i++) {
      if (right[i] == undefined) {
        return 1;       // right ran out first
      }
      const compare = compareElements(left[i], right[i]);
      if (compare != 0) {
        return compare;
      }
    }
    if (right.length > left.length) {
      return -1;         // left ran out first
    }
    return 0;
  }

  // compares two elements (array or number, or turn number to array)
  //  Left < Right => negative
  //  Left = Right => 0
  //  Left > Right => positive
  function compareElements(left, right) {
    if (typeof left == 'object' && typeof right == 'object') {
      return compareArrays(left, right);
    } else if (typeof left == 'number' && typeof right == 'number') {
      return left - right;
    } else if (typeof left == 'number') {
      return compareArrays([left], right);  // promote to array
    } else { 
      return compareArrays(left, [right]);  // promote to array
    }
   }

}

solve();
