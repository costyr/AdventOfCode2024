const util = require('./Util.js');
const fs = require('fs');

function ComputeMul(aMulOp) {
  let pp = aMulOp.split(',');

  return parseInt(pp[0].split('(')[1]) * parseInt(pp[1].split(')')[0]);
}

function ComputeTotal(aRawInput) {
  let tt = aRawInput.match(/mul\([0-9]*,[0-9]*\)/g);

  return tt.reduce((aTotal, aElem)=>{
    return aTotal + ComputeMul(aElem);
  }, 0);
}

function ComputeTotal2(aRawInput) {
  let tt = aRawInput.match(/mul\([0-9]*,[0-9]*\)|do\(\)|don't\(\)/g);

  let compute = true;

  return tt.reduce((aTotal, aElem)=>{

  if (aElem == "do()") {
    compute = true;
    return aTotal;
  }
  else if (aElem == "don't()")
  {
    compute = false;
    return aTotal;
  }
  else {
    if (!compute)
      return aTotal;

    return aTotal + ComputeMul(aElem);
  }

}, 0);
}

let rawInput = fs.readFileSync("./Day3Input.txt", 'utf-8');

console.log(ComputeTotal(rawInput));

console.log(ComputeTotal2(rawInput));
