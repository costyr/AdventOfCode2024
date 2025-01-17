const util = require('./Util.js');

function ComputeOp(aOperation, aValuesMap) 
{
  let v1 = aValuesMap.get(aOperation.v1);
  let v2 = aValuesMap.get(aOperation.v2);

  if (v1 == undefined || v2 == undefined)
    return -1;

  let r = 0;
  if (aOperation.op == "OR")
    r = v1 | v2;
  else if (aOperation.op == "AND")
    r = v1 & v2;
  else if (aOperation.op == "XOR")
    r = v1 ^ v2;

  //if (aValuesMap.has(aOperation.r))
  //  return -1;

  aValuesMap.set(aOperation.r, r);
  return r;
}

function ComputeAll(aOperations, aValuesMap) 
{
  while (1) {
    let allReady = true;
    let newCount = 0;
    for (let i = 0; i < aOperations.length; i++)
    {
      let computed = ComputeOp(aOperations[i], aValuesMap);

      if (computed == -1)
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

  //for (let i = 0; i < z.length; i++)
  //  z[i] = 0;

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

function ToResult(aOperations, aResult) 
{
  let pp = [];
  for (let i = 0; i < aResult.length; i++)
   pp.push(aOperations[aResult[i]].r);

  console.log(pp.toString());

  pp.sort((a, b)=>{ return a.localeCompare(b);});

  return pp.toString();
}

function Simulate2(aOperations, aValuesMap, aExpected, aResult, aTotal)  
{
  if (aResult.length == 4) {

 // console.log(aResult);

  let [b, n] = ComputeAll(aOperations, aValuesMap);

  let count = 0;
  for (let i = 0; i < b.length; i++)
    if (aExpected[i] == b[i])
      count++;

  if (count > aTotal.max)
  {
    aTotal.max = count;

    console.log(count + " / " + b.length + " " + ToResult(aOperations, aResult));
  }

  if (count == b.length)
  {

    console.log(ToResult(aOperations, aResult));

    //for (let i = 0; i < aOperations.length; i++)
    //  console.log(aOperations[i].v1 + " " + aOperations[i].op + " " + aOperations[i].v2 + " -> " + aOperations[i].r);
  }

  return;
}

  let found = false;
  for (let i = 0; i < aOperations.length; i++) {
    for (let j = i + 1; j < aOperations.length; j++)
    {
      if (aResult.indexOf(i) != -1 || 
          aResult.indexOf(j) != -1)
        continue;

      let newOperations = util.CopyObject(aOperations);
      
      let tmp = newOperations[i].r;
      newOperations[i].r = newOperations[j].r;
      newOperations[j].r = tmp;

      let newValuesMap = new Map(aValuesMap);

      let newResult = [...aResult];
      newResult.push(i);
      newResult.push(j);
      Simulate2(newOperations, newValuesMap, aExpected, newResult, aTotal);
      found = true;
      //break;
    }

    //if (found)
    //  break;
  }      
}

function ComputeExpression(aVariable, aOperationsMap, aValuesMap, aTotal) 
{
  if (aVariable.startsWith('x') || 
      aVariable.startsWith('y'))
  {
    if (aTotal.exp.length > 0)
      aTotal.exp += " ";
    aTotal.exp += aValuesMap.get(aVariable);
    return;
  }

  /*if (aTotal.expMap.has(aVariable)) {
    aTotal.invalid = true;
    return;
  }*/

  aTotal.expMap.set(aVariable, 1);

  let op = aOperationsMap.get(aVariable);

 if (aTotal.exp.length > 0)
    aTotal.exp += " ";
  aTotal.exp += "(";

  ComputeExpression(op.v1, aOperationsMap, aValuesMap, aTotal);

  if (aTotal.exp.length > 0)
    aTotal.exp += " ";

  let operand = "^";
  if (op.op == "AND")
    operand = "&&";
  else if (op.op == "OR")
    operand = "||";

  aTotal.exp += operand;

  ComputeExpression(op.v2, aOperationsMap, aValuesMap, aTotal);

  if (aTotal.exp.length > 0)
    aTotal.exp += " ";
  aTotal.exp += ")"
}

function ComputeZExpressions(aOperationsMap, aValuesMap) 
{
  let zz = [];
 for (let [key, value] of aOperationsMap) {

  if (!key.startsWith('z'))
    continue;

  zz.push(key);
}

zz.sort((a, b) => {return a.localeCompare(b);});

let diff = [];
for (let i = 0; i < zz.length; i++) {
   let t1 = { exp: "", expMap: new Map(), invalid: false };

   ComputeExpression(zz[i], aOperationsMap, aValuesMap, t1);

   if (t1.invalid)
    continue;

   let z = eval(t1.exp);

   if (zzz[i] != z) {

    diff.push(parseInt(zz[i].substr(1)));

   console.log(zz[i]);
   console.log(t1.exp);
   //console.log(z);
   }
 }

 return diff;
}

function TestSwap(aOperations, aValuesMap, aDiffCount) 
{
  let diffPossible = [28, 29, 30, 39];
  let gg = ['bfq', 'bng', 'fjp', 'z31'];

  let mm = [];

  for (let i = 0; i < aOperations.length; i++)
    for (let j = i + 1; j < aOperations.length; j++)
    {
      let newOperations = util.CopyObject(aOperations);

      SwapResult(i, j, newOperations);

      let newOperationsMap = new Map();
      for (let k = 0; k < newOperations.length; k++)
        newOperationsMap.set(newOperations[k].r, { v1: newOperations[k].v1, op: newOperations[k].op, v2: newOperations[k].v2 });

      let diff = ComputeZExpressions(newOperationsMap, aValuesMap);

      if (diff.length <= aDiffCount) {

        let good = true;
        for (let k = 0; k < diff.length; k++)
          if (diffPossible.indexOf(diff[k]) == -1) {
            good = false
            break;
          }


        let yy = [newOperations[i].r, newOperations[j].r];
        let good2 = false;
        for (let k = 0; k < yy.length; k++)
          if (gg.indexOf(yy[k]) != -1) {
            good2 = true;
            break;
          }

        if (good && good2) {
          console.log(newOperations[i].r + "," + newOperations[j].r + " " + diff);
          mm.push(newOperations);
        }
      }
    }

  return mm;
}

function FindSwaped(aOperations, aOperationsMap) 
{
  let swaped = [];

  for (let i = 0; i < aOperations.length; i++)
  {
    if (aOperations[i].op == "XOR")
    {
      if (!aOperations[i].r.startsWith('z') && !(aOperations[i].v1.startsWith('x') || aOperations[i].v1.startsWith('y')))
        swaped.push(aOperations[i].r);
      else
      {
        if (aOperations[i].v1.startsWith('x') || aOperations[i].v1.startsWith('y'))
        {
          let next = aOperationsMap.get(aOperations[i].r);
          
          //if (next.op != "XOR")
          //  swaped.push(aOperations[i].r);
        }
        else 
        {
          if (aOperations[i].r.startsWith('z') && parseInt(aOperations[i].r.substr(1)) != 1) 
          {
            let bitPos = -1;

            let next1 = aOperationsMap.get(aOperations[i].v1);
            if ((next1.v1.startsWith('x') || next1.v1.startsWith('y')) && (next1.op == 'AND' || next1.op == "OR")) 
            {
              swaped.push(aOperations[i].v1);

              bitPos = parseInt(next1.v1.substr(1));
            }

            let next2 = aOperationsMap.get(aOperations[i].v2);
            if ((next2.v2.startsWith('x') || next2.v2.startsWith('y')) && (next2.op == 'AND' || next2.op == "OR")) 
            {
              swaped.push(aOperations[i].v2);

              bitPos = parseInt(next2.v1.substr(1));
            }

            if (bitPos > 0)
            for (let [key, value] of operationsMap)
              {
                if ((value.v1.startsWith('x') || value.v1.startsWith('y')) && (value.op == 'XOR') && parseInt(value.v1.substr(1)) == bitPos)
                {
                  swaped.push(key);
                  break;
                }
              }
          }
        }  
      }
    }
    else if (aOperations[i].op == 'OR' || 
             aOperations[i].op == 'AND')
    {
      if (aOperations[i].r.startsWith('z') && parseInt(aOperations[i].r.substr(1)) != 45)
        swaped.push(aOperations[i].r);      
    }
  }

  return swaped;
}

let valuesMap = new Map();
let operations = [];
let operationsMap = new Map();

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

       operationsMap.set(dd[4], { v1: dd[0], op: dd[1], v2: dd[2] });
     });   
  }

 }, "\r\n\r\n");

 //console.log(valuesMap);
 //console.log(operations);
 //console.log(operationsMap);

 let [b, n] = ComputeAll(operations, valuesMap);

 console.log(n);
 /*console.log(b);

 let [e, en] = ComputeExpected(valuesMap);

 console.log(e);
 console.log(en);

 let zzz = e.split("").map((aElem)=>{ return parseInt(aElem)}).reverse();
 console.log(zzz);*/

 //Simulate2(operations, valuesMap, e, [], {max: 0});

 //console.log(ComputeZExpressions(operationsMap, valuesMap));
 
 //let mm = TestSwap(operations, valuesMap, 3);

 //for (let i = 0; i < mm.length; i++)
 //  TestSwap(mm[i], valuesMap, 0);

 // ['bfq','z27','bng','fjp','z18','hmt','z31','hkh']

let oo = FindSwaped(operations, operationsMap);

oo.sort((a, b)=>{ return a.localeCompare(b);});

console.log(oo.toString());
