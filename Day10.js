const util = require('./Util.js');
const matrix = require('./Matrix.js');

const kNeighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function FindTrail(aStep, aPos, aMap, aResult) 
{
  if (aStep == 9) 
  {
    aResult.score.set(aPos.x + "_" + aPos.y, 1);
    aResult.score2++;
    return;
  }

  for (let i = 0; i < kNeighbours.length; i++)
  {
    let x = aPos.x + kNeighbours[i][0];
    let y = aPos.y + kNeighbours[i][1];

    if ((x >= 0) && (x < aMap[0].length) && (y >= 0) && (y < aMap.length) && (aMap[y][x] == (aStep + 1)))
      FindTrail(aMap[y][x], {x: x, y: y}, aMap, aResult);
  }    
}

function ComputeTrailScore(aHead, aMap) 
{
  let result = { score : new Map(), score2: 0 };
  FindTrail(0, aHead, aMap, result);

  return { part1: result.score.size, part2: result.score2 };
}

function ComputeTrailsTotalScore(aHeads, aMap) 
{
  let total = 0;
  let total2 = 0;
  for (let i = 0; i < aHeads.length; i++) {
    let score = ComputeTrailScore(aHeads[i], aMap);
    total += score.part1;
    total2 += score.part2;
  }

  return [ total, total2 ];
}

let heads = [];

let lavaMap = util.MapInput("./Day10Input.txt", (aElem, aY) => {

  return aElem.split("").map((aa, aX)=>{ 
    let pp = parseInt(aa); 

    if (pp == 0)
      heads.push({x: aX, y: aY});

    return pp;
  });

}, "\r\n");

//matrix.CreateMatrix(lavaMap).Print("");

ComputeTrailScore(heads[0], lavaMap);

console.log(ComputeTrailsTotalScore(heads, lavaMap));
