const util = require('./Util.js');

function ComputePagesIndex(aPages, aRulesMap) {
  let total = 0;
  let total2 = 0;
  for (let i = 0; i < aPages.length; i++)
  {
    let yy = util.CopyObject(aPages[i]);

    aPages[i].sort((a, b)=>{
      if (aRulesMap.has(a + "|" + b))
        return -1;
      else if(aRulesMap.has(b + "|" + a)) {
        return 1;
      }
      return 0;
    });

    let isSame = true;

    for (let j = 0; j < aPages[i].length; j++)
      if (yy[j] != aPages[i][j]) {
        isSame = false;
        break;
      }

    let uu = Math.floor(aPages[i].length / 2);

    let ff = parseInt(aPages[i][uu]);

    if (isSame)
      total += ff;
    else
      total2 += ff;
  }
  
  return { total, total2 };
}

let rulesMap = new Map();

let pages = [];

util.MapInput("./Day5Input.txt", (aElem, aIndex) => {

  if (aIndex == 0)
    aElem.split("\r\n").map((aElem)=>{ rulesMap.set(aElem, 1); });
  else
    pages = aElem.split("\r\n").map((aElem)=>{ 
      return aElem.split(","); 
  });

}, "\r\n\r\n");

console.log(ComputePagesIndex(pages, rulesMap));
