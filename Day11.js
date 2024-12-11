const util = require('./Util.js');

function SimulateBlink(aBlinkCount, aStones) 
{
  let j = 0;
  let stones = aStones;
  while (j++ < aBlinkCount) 
  {
    let newStones = new Map();
    for (let [key, value] of stones) {
      if (key == 0) 
      {
        newStones.set(1, (newStones.has(1) ? newStones.get(1) + value: value));
      }
      else
      {
        let str = key.toString();
        if (str.length % 2 == 0)
        {
          let midIndex = str.length / 2;

          let s1 = parseInt(str.slice(0, midIndex));
          let s2 = parseInt(str.slice(midIndex));
          
          newStones.set(s1, (newStones.has(s1) ? newStones.get(s1) + value: value));
          newStones.set(s2, (newStones.has(s2) ? newStones.get(s2) + value: value));
        }
        else 
        {
          let newStone = key * 2024;

          newStones.set(newStone, (newStones.has(newStone) ? newStones.get(newStone) + value: value));
        }
      }
    }

    stones = newStones;
  }

  let total = 0;
  for (let [key, value] of stones)
     total += value;
  return total;
}

let stones = new Map(); 

util.MapInput("./Day11Input.txt", (aElem) => {

  let hh = parseInt(aElem);

  stones.set(hh, 1);

  return hh;

}, " ");

console.log(SimulateBlink(25, stones));

console.log(SimulateBlink(75, stones));
