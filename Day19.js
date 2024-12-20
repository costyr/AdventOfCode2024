const util = require('./Util.js');

function IsPossible(aPattern, aIndex, aMap, aTotal, aCache) {

  let key = aPattern.slice(aIndex).toString().replaceAll(/,/g, "");

  if (aCache.has(key))
  {
    aTotal.count += aCache.get(key);
    return true;
  }

  let subPattern = "";
  for (let i = aIndex; i < aPattern.length; i++)
  {
    subPattern += aPattern[i];

    if (aMap.has(subPattern))
    {
      if (i + 1 >= aPattern.length)
      {
        aTotal.count ++;
        return true;
      }

      let rr = { count: 0 };
      IsPossible(aPattern, i + 1, aMap, rr, aCache);

      if (rr.count > 0)
      {
        let key = aPattern.slice(i + 1).toString().replaceAll(/,/g, "");

        if (!aCache.has(key))
          aCache.set(key, rr.count);

        aTotal.count += rr.count;
      }
    }
  }

  return false;
}

function CountPossiblePatterns(aPatterns, aMap) {
  
  let count = 0;
  let possible = 0;
  let cache = new Map();
  for (let i = 0; i < aPatterns.length; i++)
  {
    let tt = { count: 0};
    IsPossible(aPatterns[i], 0, aMap, tt, cache);
    count += tt.count;

    if (tt.count > 0)
      possible ++;
  }

  return [possible, count];
}

let patterns = [];
let towels = [];

let patternMap = new Map();

util.MapInput("./Day19Input.txt", (aElem, aIndex) => {

 if (aIndex == 0)
   patterns = aElem.split(", ").map((aa)=>{
     patternMap.set(aa, 1);
     return aa;
    });
  else
   towels = aElem.split("\r\n");

}, "\r\n\r\n");

console.log(CountPossiblePatterns(towels, patternMap));