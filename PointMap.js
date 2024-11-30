const matrix = require('./Matrix.js');

function GetKey(aPoint) {
  return aPoint.reduce((aTotal, aElem) => {
    if (aTotal.length > 0)
      aTotal += "#";
    aTotal += aElem.toString();
    return aTotal;
  }, "");
}

function DecodePoint(aFlatPoint) {
  return aFlatPoint.split('#').map(aElem => {
    return parseInt(aElem);
  });
}

function Compute2DNeighboursTransform() {
  const neighboursTransform2D = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  return neighboursTransform2D;
}

function ComputeNthNeighboursTransform(aNth) {
  if (aNth == 2)
    return Compute2DNeighboursTransform();
  else {
    const neighboursTransformN1th = ComputeNthNeighboursTransform(aNth - 1);
    const neighboursTransform = [-1, 0, 1];

    let neighboursTransformNth = [];
    for (let i = 0; i < neighboursTransform.length; i++)
      for (let j = 0; j < neighboursTransformN1th.length; j++) {

        let transformNth = [];
        for (let k = 0; k < neighboursTransformN1th[j].length; k++)
          transformNth[k] = neighboursTransformN1th[j][k];
        transformNth.push(neighboursTransform[i]);

        neighboursTransformNth.push(transformNth);
      }
    return neighboursTransformNth;
  }
}

function GetPointMapValue(aPointMap, aDefaultValue, aExtra, aPoint) {
  let key = GetKey(aPoint);
  let extendedValue = aPointMap.get(key);

  if ((extendedValue === undefined) && (aExtra != null) && !aExtra.has(key))
    aExtra.set(key, { pt: aPoint, key: key });

  let value = (extendedValue == undefined) ? aDefaultValue : extendedValue.value;

  return value;
}

function CountNthNeighbours(aGetValueFunc, aNeighboursTransform, aPoint, aCountMap) {
  for (let i = 0; i < aNeighboursTransform.length; i++) {

    let same = true;
    let pointNth = [];
    for (let k = 0; k < aPoint.length; k++) {
      pointNth[k] = aPoint[k] + aNeighboursTransform[i][k];

      if (pointNth[k] != aPoint[k])
        same = false;
    }

    if (same)
      continue;

    let value = aGetValueFunc(pointNth);

    if (!aCountMap.has(value))
      aCountMap.set(value, 1);
    else {
      let count = aCountMap.get(value);
      aCountMap.set(value, count + 1);
    }
  }
}

class PointMap {
  constructor(aNth, aDefaultValue, aNeighboursTransform) {
    this.mPoints = new Map();
    this.mNth = aNth;
    this.mDefaultValue = aDefaultValue;
    this.mNeighboursTransform = (aNeighboursTransform === undefined) ? ComputeNthNeighboursTransform(aNth) : aNeighboursTransform;
  }

  From2DMatrix(aMatrix) {
    for (let i = 0; i < aMatrix.length; i++)
      for (let j = 0; j < aMatrix[i].length; j++) {
        let point = [j, i];
        for (let k = 2; k < this.mNth; k++)
          point.push(0);

        this.mPoints.set(GetKey(point), { pt: point, value: aMatrix[i][j] });
      }
  }

  CountElement(aElementValue, aFilterFunc) {
    let count = 0;
    for (let extendedValue of this.mPoints.values()) {

      let countedValue = (aFilterFunc !== undefined) ? aFilterFunc(extendedValue) : extendedValue.value;

      if (aElementValue == countedValue)
        count++;
    }

    return count;
  }

  Add(aPoint, aValue, aKey) {
    this.mPoints.set((aKey !== undefined) ? aKey : GetKey(aPoint), { pt: aPoint, value: aValue });
  }

  Transform(aTransformFunc) {
    let newPointMap = new PointMap(this.mNth, this.mDefaultValue, this.mNeighboursTransform);
    let neighbourCoords = new Map();

    const getPointMapValueFunc = GetPointMapValue.bind(null, this.mPoints, this.mDefaultValue, neighbourCoords);
    for (let [key, value] of this.mPoints) {
      let point = value.pt;
      let countMap = new Map();
      CountNthNeighbours(getPointMapValueFunc, this.mNeighboursTransform, point, countMap);
      aTransformFunc(point, key, value, countMap, newPointMap);
    }

    const getPointMapValueNoExtraFunc = GetPointMapValue.bind(null, this.mPoints, this.mDefaultValue, null);
    for (let [key, value] of neighbourCoords) {
      let neighbourPoint = value.pt;
      if (!this.mPoints.has(key)) {
        let countMap = new Map();
        CountNthNeighbours(getPointMapValueNoExtraFunc, this.mNeighboursTransform, neighbourPoint, countMap);
        aTransformFunc(neighbourPoint, key, null, countMap, newPointMap);
      }
    }

    return newPointMap;
  }

  Print(aSeparator, aFilterFunc) {
    let minMax = [];
    for (let extendedValue of this.mPoints.values()) {
      let point = extendedValue.pt;

      for (let i = 0; i < point.length; i++)
        if (minMax[i] == undefined)
          minMax[i] = [point[i], point[i]];
        else {
          if (point[i] < minMax[i][0])
            minMax[i][0] = point[i];
          if (point[i] > minMax[i][1])
            minMax[i][1] = point[i];
        }
    }

    let width = minMax[0][1] - minMax[0][0];
    let height = minMax[1][1] - minMax[1][0];

    let nthMap = new Map();

    for (let extendedValue of this.mPoints.values()) {
      let point = extendedValue.pt;
      let x = point[0] + Math.abs(minMax[0][0]);
      let y = point[1] + Math.abs(minMax[1][0]);

      let nthMapKey = "";
      for (let i = 2; i < point.length; i++) {
        if (nthMapKey.length > 0)
          nthMapKey += "#";
        nthMapKey += point[i].toString();
      }

      let matrix2D = nthMap.has(nthMapKey) ? nthMap.get(nthMapKey) : new matrix.Matrix(width + 1, height + 1, this.mDefaultValue);
      if (!nthMap.has(nthMapKey))
        nthMap.set(nthMapKey, matrix2D);

      matrix2D.SetValue(y, x, extendedValue.value);
    }

    for (let [key, value] of nthMap) {
      console.log("\n" + key);
      value.Print(aSeparator, aFilterFunc);
    }
  }
}

module.exports = {
  PointMap,
  ComputeNthNeighboursTransform,
  CountNthNeighbours
}