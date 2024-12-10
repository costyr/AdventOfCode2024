const util = require('./Util.js');
const matrix = require('./Matrix.js');

function ComputeFreqAntidotes(aFreq1, aFreq2, aMap, aAntidoteMap) {
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

   if (x0 >= 0 && x0 < aMap[0].length && y0 >= 0 && y0 < aMap.length)
   {
     let key = x0 + "_" + y0;

     console.log(key);

     aAntidoteMap.set(key, 1);
   }

   if (x1 >= 0 && x1 < aMap[0].length && y1 >= 0 && y1 < aMap.length)
   {
      let key = x1 + "_" + y1;
      aAntidoteMap.set(key, 1);

      console.log(key);
   }
}

function ComputeAntidotes(aFreqMap, aMap) {

  let antidoteMap = new Map();
  for (let [key, value] of aFreqMap)
  {
    for (let i = 0; i < value.length; i++)
      for (let j = i + 1; j < value.length; j++)
        ComputeFreqAntidotes(value[i], value[j], aMap, antidoteMap);         
  }

  let mm = util.CopyObject(aMap);

  for (let [key, value] of antidoteMap)
  {
    let pp = key.split("_");

    let x = parseInt(pp[0]);
    let y = parseInt(pp[1]);

    mm[y][x] = "#";
  }

  matrix.CreateMatrix(mm).Print("");

  return antidoteMap.size;
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

console.log(map);

console.log(freqMap);

console.log(ComputeAntidotes(freqMap, map));
