const kNone = 0;
const kFlipUp = 1;
const kFlipLeft = 2;
const kRotate = 3;

function PrintLine(aLine, aSeparator, aFilterFunc) {
  let line = "";
  for (let i = 0; i < aLine.length; i++) {
    if ((aSeparator !== undefined) && (line.length > 0))
      line += aSeparator;
    line += (aFilterFunc !== undefined) ? aFilterFunc(aLine[i]) : aLine[i];
  }

  return line;
}

function CreateMatrix(aRawMatrix) {
  let matrix = new Matrix(0, 0);
  matrix.mMatix = aRawMatrix;

  return matrix;
}

class Matrix {
  constructor(aWidth, aHeight, aValue) {
    this.mMatix = [];
    for (let i = 0; i < aHeight; i++) {
      this.mMatix[i] = [];
      for (let j = 0; j < aWidth; j++)
        this.mMatix[i][j] = aValue;
    }
  }

  GetMatrix() {
    return this.mMatix;
  }

  SetValue(aLine, aCol, aValue) {
    this.mMatix[aLine][aCol] = aValue;
  }

  GetValue(aLine, aCol) {
    return this.mMatix[aLine][aCol];
  }

  Copy() {
    let height = this.mMatix.length;
    let width = height > 0 ? this.mMatix[0].length : 0;
    let newMatrix = new Matrix(0, 0);

    for (let i = 0; i < height; i++) {
      if (newMatrix[i] === undefined)
        newMatrix.mMatix[i] = [];
      for (let j = 0; j < width; j++)
        newMatrix.SetValue(i, j, this.GetValue(i, j));
    }

    return newMatrix;
  }

  AddPattern(aPattern, aDestX, aDestY, aStartX, aStartY, aLengthX, aLengthY) {
    if (this.mMatix.length == 0)
      return;

    if ((aLengthY == 0) || (aLengthY > this.mMatix.length) ||
      (aLengthX == 0) || (aLengthX > this.mMatix[0].length))
      return;

    for (let i = 0; i < aLengthY; i++)
      for (let j = 0; j < aLengthX; j++)
        this.SetValue(aDestY + i, aDestX + j, aPattern[aStartY + i][aStartX + j]);
  }

  Flip(aUp) {
    let height = this.mMatix.length;
    let width = height > 0 ? this.mMatix[0].length : 0;
    let newMatrix = new Matrix(0, 0);

    for (let i = 0; i < height; i++) {
      let k = aUp ? (height - 1 - i) : i;
      if (newMatrix[k] === undefined)
        newMatrix.mMatix[k] = [];
      for (let j = 0; j < width; j++)
        newMatrix.SetValue(k, aUp ? j : (width - 1 - j), this.GetValue(i, j));
    }

    return newMatrix;
  }

  Rotate() {
    let height = this.mMatix.length;
    let width = height > 0 ? this.mMatix[0].length : 0;
    let newMatrix = new Matrix(0, 0);

    for (let i = 0; i < height; i++) {
      if (newMatrix[i] === undefined)
        newMatrix.mMatix[i] = [];
      for (let j = 0; j < width; j++)
        newMatrix.SetValue(i, width - 1 - j, this.GetValue(j, i));
    }

    return newMatrix;
  }

  ApplyTransforms(aTransforms) {
    let newImage = this;
    for (let i = 0; i < aTransforms.length; i++)
      if (aTransforms[i] == 1)
        newImage = newImage.Flip(true);
      else if (aTransforms[i] == 2)
        newImage = newImage.Flip(false);
      else if (aTransforms[i] == 3)
        newImage = newImage.Rotate();
    return newImage;
  }

  FindPattern(aPattern, aIgnore) {
    if (aPattern.length == 0)
      return 0;

    let count = 0;
    for (let i = 0; i < this.mMatix.length - aPattern.length; i++)
      for (let j = 0; j < this.mMatix[i].length - aPattern[0].length; j++) {
        let found = true;
        for (let k = 0; k < aPattern.length; k++)
          for (let l = 0; l < aPattern[k].length; l++)
            if ((aIgnore.indexOf(aPattern[k][l]) == -1) && (this.mMatix[i + k][j + l] != aPattern[k][l])) {
              found = false;
              break;
            }

        if (found)
          count++;
      }
    return count;
  }

  CountElement(aElementValue) {
    let count = 0;
    for (let i = 0; i < this.mMatix.length; i++)
      for (let j = 0; j < this.mMatix[i].length; j++)
        if (this.mMatix[i][j] == aElementValue)
          count++;

    return count;
  }

  Print(aSeparator, aFilterFunc) {
    for (let i = 0; i < this.mMatix.length; i++)
      console.log(PrintLine(this.mMatix[i], aSeparator, aFilterFunc));
  }

  ToString(aSeparator, aFilterFunc) {
    let ss = "";
    for (let i = 0; i < this.mMatix.length; i++) {
      if (ss.length > 0)
        ss += " ";
      ss += PrintLine(this.mMatix[i], aSeparator, aFilterFunc);
      ss += "\r\n";
    }

    return ss;
  }

  PrintReverse(aSeparator, aFilterFunc) {
    for (let i = this.mMatix.length - 1; i >= 0; i--)
      console.log(PrintLine(this.mMatix[i], aSeparator, aFilterFunc));
  }
}

module.exports = {
  Matrix,
  CreateMatrix,
  kNone,
  kFlipUp,
  kFlipLeft,
  kRotate
}
