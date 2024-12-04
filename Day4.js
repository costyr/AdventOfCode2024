const util = require('./Util.js');

const kNeighboursTransform2D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

const kXMAS = [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]];

const kXMASWords = [ "MSAMS", "SSAMM", "MMASS", "SMASM" ];

function CountXMAS2(aX, aY, aMap, aWord) {
  let x_mas = "";
  for (let j = 0; j < kXMAS.length; j++)
    {
      let x = aX + kXMAS[j][0];
      let y = aY + kXMAS[j][1];
      if ((x >= 0) && (x < aMap[0].length) && 
          (y >= 0) && (y < aMap.length))
      {
        x_mas += aMap[y][x];
      }
    }

  return (x_mas == aWord);
}

function CountXMAS(aX, aY, aMap, aWord) {

  if (aMap[aY][aX] != aWord[0])
    return 0;

  let count = 0;
  for (let i = 0; i < kNeighboursTransform2D.length; i++)
  {
    let xmas = aMap[aY][aX];
    let x = aX;
    let y = aY;
    for (let j = 0; j < 3; j++)
    {
      x += kNeighboursTransform2D[i][0];
      y += kNeighboursTransform2D[i][1];
      if ((x >= 0) && (x < aMap[0].length) && 
          (y >= 0) && (y < aMap.length))
      {
        xmas += aMap[y][x];
      }
    }

    if (xmas == aWord) 
      count++;
  }

  return count;
}

function CountAllXMAS2(aMap) {
  let total = 0;
  for (let i = 0; i < aMap.length; i++)
    for(let j = 0; j < aMap[i].length; j++)
  {
    for (let k = 0; k < kXMASWords.length; k++)
      total += (CountXMAS2(j, i, aMap, kXMASWords[k]) ? 1 : 0);
  }

  return total;
}

function CountAllXMAS(aMap) {
  let total = 0;
  for (let i = 0; i < aMap.length; i++)
    for(let j = 0; j < aMap[i].length; j++)
  {
    total += CountXMAS(j, i, aMap, "XMAS");
  }

  return total;
}

let ll = util.MapInput("./Day4Input.txt", (aElem) => {

  return aElem.split("");

}, "\r\n");

console.log(CountAllXMAS(ll));

console.log(CountAllXMAS2(ll));
