const util = require('./Util.js');

function CountValidCalibration(aIndex, aCalibration, aValue, aResult, aPart2) {

  if (aIndex == aCalibration.length)
  {
    if (aValue == aCalibration[0])
      aResult.total++;

    return;
  }

  CountValidCalibration(aIndex + 1, aCalibration, aValue * aCalibration[aIndex], aResult, aPart2); 

  CountValidCalibration(aIndex + 1, aCalibration, aValue + aCalibration[aIndex], aResult, aPart2);

  if (aPart2) {
    let nextValue = Math.pow(10, aCalibration[aIndex].toString().length) * aValue + aCalibration[aIndex];

    CountValidCalibration(aIndex + 1, aCalibration, nextValue, aResult, aPart2); 
  }
}

function CountValidCalibrations(aCalibrationa, aPart2) {
  let count = 0;
  for (let i = 0; i < aCalibrationa.length; i++) {
    let result = { total: 0 };
    CountValidCalibration(2, aCalibrationa[i], aCalibrationa[i][1], result, aPart2);
  
    if (result.total > 0) 
      count += aCalibrationa[i][0];
  }
  return count;
}

let calibrations = util.MapInput("./Day7Input.txt", (aElem) => {

  return aElem.split(" ").map((aa, aIndex)=>{
    if (aIndex == 0)
      return parseInt(aa.split(":")[0]);
  
    return parseInt(aa);
  });

}, "\r\n");

console.log(CountValidCalibrations(calibrations, false));

console.log(CountValidCalibrations(calibrations, true));
