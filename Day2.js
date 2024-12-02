const util = require('./Util.js');

function IsRepotSafe(aReport) {
  let safe = true;
  let ordered = 0;
  for (let i = 0; i < (aReport.length - 1); i++) {
    let kk = aReport[i] - aReport[i + 1];

    ordered += kk > 0 ? 1 : -1;

    let bb = Math.abs(kk);
    if (bb > 3 || bb < 1) {
      safe = false;
      break;
    }
  }

  let isSafe = safe && (Math.abs(ordered) == (aReport.length - 1));
  
  if (isSafe)
    console.log(aReport + " " + ordered + " " + safe + " " + isSafe);
   
   return isSafe;
}

function ComputeSafeReports(aReports) {
  let unsafeCount = aReports.reduce((aTotal, aElem)=>{     
     return IsRepotSafe(aElem) ? aTotal : (aTotal + 1);
  }, 0);
  
  return aReports.length - unsafeCount;
}

function ComputeSafeReports2(aReports) {
  let unsafeCount = aReports.reduce((aTotal, aElem)=>{     
    if (IsRepotSafe(aElem))
      return aTotal;
    else {

      for (let i = 0; i <= (aElem.length - 1); i++)
      {
        pp = util.CopyObject(aElem);
        pp.splice(i, 1);
        if (IsRepotSafe(pp))
          return aTotal;
      }

      return (aTotal + 1);
    }
  }, 0);
  
  return aReports.length - unsafeCount;
}

let ll = util.MapInput("./Day2Input.txt", (aElem) => {

  return aElem.split(" ").map((aElem)=>{return parseInt(aElem);});

}, "\r\n");

console.log(ll);

console.log(ComputeSafeReports(ll));

console.log(ComputeSafeReports2(ll));