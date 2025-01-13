const util = require('./Util.js');

function ComputeOp(aOperation, aValuesMap) 
{
  let v1 = aValuesMap.get(aOperation.v1);
  let v2 = aValuesMap.get(aOperation.v2);

  if (v1 == undefined || v2 == undefined)
    return [ false, 0];

  let r = 0;
  if (aOperation.op == "OR")
    r = v1 | v2;
  else if (aOperation.op == "AND")
    r = v1 & v2;
  else if (aOperation.op == "XOR")
    r = v1 ^ v2;

  if (aValuesMap.has(aOperation.r))
    return [false, 0];

  aValuesMap.set(aOperation.r, r);
  return [true, r];
}

function ComputeAll(aOperations, aValuesMap) 
{
  while (1) {
    let allReady = true;
    let newCount = 0;
    for (let i = 0; i < aOperations.length; i++)
    {
      if (!ComputeOp(aOperations[i], aValuesMap)[0])
        allReady = false;
      else 
        newCount ++;
    }

    if (allReady || newCount == 0)
      break;
  }

  //console.log(aValuesMap);

  let z = [];
  for (let [key, value] of aValuesMap)
  {
    if (key.startsWith("z"))
    {
      z[parseInt(key.substr(1))] = value;
    }
  }

  for (let i = 5; i < z.length; i++)
    z[i] = 0;

  let gg = z.reverse().toString().replaceAll(/,/g, "");
  let number = parseInt(gg, 2);

  return [gg, number];
}

function ComputeExpected(aValuesMap) 
{
  let x = [];
  let y = [];
  for (let [key, value] of aValuesMap)
  {
    if (key.startsWith("x"))
    {
      x[parseInt(key.substr(1))] = value;   
    }
    
    else if (key.startsWith("y"))
    {
      y[parseInt(key.substr(1))] = value;   
    }
  }

  let x0 = x.reverse().toString().replaceAll(/,/g, "");
  let y0 = y.reverse().toString().replaceAll(/,/g, "");

  let z = parseInt(x0, 2) + parseInt(y0, 2);

  return [z.toString(2), z];
}

function SwapResult(aIndex1, aIndex2, aOperations) 
{
  if (aIndex1 < 0 || aIndex1 >= aOperations.length ||
      aIndex2 < 0 || aIndex2 >= aOperations.length)
    return;

  let temp = aOperations[aIndex1].r;

  aOperations[aIndex1].r = aOperations[aIndex2].r;
  aOperations[aIndex2].r = temp;
}

function Simulate(aOperations, aValuesMap) 
{
  let [expected, nr] = ComputeExpected(aValuesMap);

  let max = 0;

  for (let i = 0; i < aOperations.length; i++) {
    let found = false;
    for (let j = i + 1; j < aOperations.length; j++) 
  {
    let uu = util.CopyObject(aOperations);
    let vv = new Map(aValuesMap);

    SwapResult(i, j, uu);

    let [g, n] = ComputeAll(uu, vv);

    //if (g.length != 13)
     // continue;

    let gg = n ^ nr;

    let hh = gg.toString(2).split("").map((aElem)=>{ return parseInt(aElem); });

    let count = 0;

    for (let k = 0; k < hh.length; k++)
      if (hh[k] == 1)
        count ++;

    if (count > max) {
      console.log(i + " " + j + ": " + g + " " + n + "[" + aOperations[i].r + ", " + aOperations[j].r + "]");
      max = count;
    }
  }

  if (found)
    break;
}
}

let valuesMap = new Map();
let operations = [];

util.MapInput("./Day24Input.txt", (aElem, aIndex) => {
  
  if (aIndex == 0)
  {
    aElem.split("\r\n").map((aa)=>{ 
      let cc = aa.split(": ");  

      valuesMap.set(cc[0], parseInt(cc[1]));
    });
  }
  else
  {
     aElem.split("\r\n").map((bb)=>{
       let dd = bb.split(" ");
       
       operations.push({ v1: dd[0], op: dd[1], v2: dd[2], r: dd[4] });
     });   
  }

 }, "\r\n\r\n");

 console.log(valuesMap);
 console.log(operations);

 //let [b, n] = ComputeAll(operations, valuesMap);

 //console.log(n);
 //console.log(b);

 //ComputeExpected(valuesMap);

 Simulate(operations, valuesMap);
