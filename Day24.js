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

  aValuesMap.set(aOperation.r, r);
  return [true, r];
}

function ComputeAll(aOperations, aValuesMap) 
{
  while (1) {
    let allReady = true;
    for (let i = 0; i < aOperations.length; i++)
    {
      if (!ComputeOp(aOperations[i], aValuesMap)[0])
        allReady = false;
    }

    if (allReady)
      break;
  }

  console.log(aValuesMap);

  let z = [];
  for (let [key, value] of valuesMap)
  {
    if (key.startsWith("z"))
    {
      z[parseInt(key.substr(1))] = value;
    }
  }

  let gg = z.reverse().toString().replaceAll(/,/g, "");
  let number = parseInt(gg, 2);

  return [gg, number];
}

function Part2(aOperations, aValuesMap) 
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

  //console.log(x0);
  //console.log(y0);
  //console.log(z);
  console.log(z.toString(2));
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

 let [b, n] = ComputeAll(operations, valuesMap);

 console.log(n);
 console.log(b);

 Part2(operations, valuesMap);
