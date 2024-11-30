const util = require('./Util.js');
const matrix = require('./Matrix.js');

function GenerateMatrix(aWidth, aHeight, aDefaultValue) {
  return new matrix.Matrix(aWidth, aHeight, aDefaultValue).GetMatrix();
}

function GenerateNthMatrix(aSize, aDefaultValue) {

  if (aSize.length == 2)
    return GenerateMatrix(aSize[0], aSize[1], aDefaultValue);

  let matrix = [];
  for (let i = 0; i < aSize[aSize.length - 1]; i++)
    matrix[i] = GenerateNthMatrix(aSize.slice(0, aSize.length - 1), aDefaultValue);
  return matrix;
}

function Generate3DMatrix(aWidth, aHeight, aDepth, aDefaultValue) {
   return GenerateNthMatrix([aWidth, aHeight, aDepth], aDefaultValue);
}

function Generate4DMatrix(aWidth, aHeight, aDepth, aTime, aDefaultValue) {
  return GenerateNthMatrix([aWidth, aHeight, aDepth, aTime], aDefaultValue);
}

function Copy2DtoNth(aNth, aNthMatrix, a2DMatrix, aPoint) {
  if (aNth == 2) {
    for (let y = 0, j = aPoint[1]; y < a2DMatrix.length; y++, j++) 
      for (let x = 0, i = aPoint[0]; x < a2DMatrix[y].length; x++, i++)
        aNthMatrix[j][i] = a2DMatrix[y][x];
  }
  else 
    Copy2DtoNth(aNth - 1, aNthMatrix[aPoint[aPoint.length - 1]], a2DMatrix, aPoint.slice(0, aPoint.length - 1));
}

function Extend2DMatrix(aMatrix, aDefaultValue) {

  let newRow = [];
  for (let x = 0; x < aMatrix[0].length; x++)
    newRow.push(aDefaultValue);

  aMatrix.unshift(newRow);

  for (let y = 0; y < aMatrix.length; y++) {
    aMatrix[y].unshift(aDefaultValue);
    aMatrix[y].push(aDefaultValue);
  }

  aMatrix.push(util.CopyObject(newRow));
}

function ExtractNthMatrixSize(aNth, aNthMatrix, aSize) {
  aSize.unshift(aNthMatrix.length);
  if (aNth > 1)
    ExtractNthMatrixSize(aNth - 1, aNthMatrix[0], aSize);
}

function ExtendNthMatrix(aNth, aNthMatrix, aDefaultValue) {
  if (aNth == 2) {
    Extend2DMatrix(aNthMatrix, aDefaultValue);
    return;
  }

  let size = [];
  ExtractNthMatrixSize(aNth, aNthMatrix, size);

  let nth1Size = size.slice(0, size.length - 1);

  aNthMatrix.unshift(GenerateNthMatrix(nth1Size, aDefaultValue));
  for (let i = 0; i < aNthMatrix.length; i++)
    ExtendNthMatrix(aNth - 1, aNthMatrix[i], aDefaultValue);

  for (let i = 0; i < nth1Size.length; i++)
    nth1Size[i] += 2;
  
  aNthMatrix.push(GenerateNthMatrix(nth1Size, aDefaultValue));
}

function NthCountElement(aNth, aNthMatrix, aElementValue) {
  if (aNth == 2)
    return new matrix.CreateMatrix(aNthMatrix).CountElement(aElementValue);

  let count = 0;
  for (let n = 0; n < aNthMatrix.length; n++)
    count += NthCountElement(aNth - 1, aNthMatrix[n], aElementValue);
  return count;
}

function PrintNthMatrix(aNth, aNthMatrix, aExtra, aNthSeparator, aSeparator, aFilterFunc) {
  if (aNth == 2) {
    let key = "";
    for (let i = 0; i < aExtra.length; i++) {
      if (key.length > 0)
        key += aNthSeparator;
      key += aExtra[i];
    }

    console.log(key);
    matrix.CreateMatrix(aNthMatrix).Print(aSeparator, aFilterFunc);
    console.log("\n");
    return;
  }

  for (let i = 0; i < aNthclsMatrix.length; i++)
  {
    let extra = [];
    for (let j = 0; j < aExtra.length; j++)
      extra[j] = aExtra[j];
    extra.push(i);
    PrintNthMatrix(aNth - 1, aNthMatrix[i], extra, aNthSeparator, aSeparator, aFilterFunc);
  }    
}

module.exports = {
  GenerateMatrix,
  GenerateNthMatrix,
  Generate3DMatrix,
  Generate4DMatrix,
  Copy2DtoNth,
  Extend2DMatrix,
  ExtendNthMatrix,
  NthCountElement,
  PrintNthMatrix
}