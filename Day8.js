const util = require('./Util.js');
const matrix = require('./Matrix.js');

function IsInMap(aX, aY, aMap) 
{ 
  if (aX >= 0 && aX < aMap[0].length && aY >= 0 && aY < aMap.length)
    return true;
 
  return false;
}

function AddNewAntinode(aX, aY, aAntinodeMap) 
{
  let key = aX + "_" + aY;
  aAntinodeMap.set(key, 1);
}

function CreateExtraAntinodes(aX, aY, aDx, aDy, aMap, aAntinodeMap) 
{
  let x = aX;
  let y = aY;
  while (1) {
    let x3 = x + aDx;
    let y3 = y + aDy;
    if (IsInMap(x3, y3, aMap))
      AddNewAntinode(x3, y3, aAntinodeMap);
     else
       break;
    x = x3;
    y = y3;
   }
}

function ComputeFreqAntinodes(aFreq1, aFreq2, aMap, aAntinodeMap, aPart2) {
   let dx = Math.abs(aFreq2.x - aFreq1.x);
   let dy = Math.abs(aFreq2.y - aFreq1.y);
   
   let minX = Math.min(aFreq2.x, aFreq1.x);
   let maxX = Math.max(aFreq2.x, aFreq1.x);

   let minY = Math.min(aFreq2.y, aFreq1.y);
   let maxY = Math.max(aFreq2.y, aFreq1.y);

   let x0 = minX - dx;
   let y0 = aFreq1.x > aFreq2.x ? maxY + dy : minY - dy;

   let x1 = maxX + dx;
   let y1 = aFreq1.x > aFreq2.x ? minY - dy : maxY + dy;

   if (IsInMap(x0, y0, aMap))
   {
     AddNewAntinode(x0, y0, aAntinodeMap);

     if (aPart2) {
       let edx = -dx;
       let edy = aFreq1.x > aFreq2.x ? dy : -dy;

       CreateExtraAntinodes(x0, y0, edx, edy, aMap, aAntinodeMap);
     }
   }

   if (IsInMap(x1, y1, aMap))
   {
     AddNewAntinode(x1, y1, aAntinodeMap);

     if (aPart2) {
       let edx = dx;
       let edy = aFreq1.x > aFreq2.x ? -dy : dy;

       CreateExtraAntinodes(x1, y1, edx, edy, aMap, aAntinodeMap);
     }
   }
}

function ComputeAntinodes(aFreqMap, aMap, aPart2) {

  let antinodeMap = new Map();

  if (aPart2) 
  {
    for (let i = 0; i < aMap.length; i++)
      for (let j = 0; j < aMap[i].length; j++) 
      {
        if (aMap[i][j] != ".")
          antinodeMap.set(j + "_" + i, 1);
      }
  }

  for (let [key, value] of aFreqMap)
  {
    for (let i = 0; i < value.length; i++)
      for (let j = i + 1; j < value.length; j++)
        ComputeFreqAntinodes(value[i], value[j], aMap, antinodeMap, aPart2);         
  }

  /*let mm = util.CopyObject(aMap);

  for (let [key, value] of antinodeMap)
  {
    let pp = key.split("_");

    let x = parseInt(pp[0]);
    let y = parseInt(pp[1]);

    mm[y][x] = "#";
  }

  matrix.CreateMatrix(mm).Print("");*/

  return antinodeMap.size;
}

let freqMap = new Map();

let map = util.MapInput("./Day8Input.txt", (aElem, aY) => {

  return aElem.split("").map((aElem, aX)=>{

    if (aElem != '.') {
      let pp = freqMap.get(aElem);

      if (pp == undefined)
        pp = [];  

      pp.push({x: aX, y: aY});

      freqMap.set(aElem, pp);
    } 

    return aElem;
  });

}, "\r\n");

console.log(ComputeAntinodes(freqMap, map, false));

console.log(ComputeAntinodes(freqMap, map, true));
