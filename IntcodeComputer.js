const util = require('./Util.js');

class IntcodeIOStream {
  constructor(aStream) {
    this.mStream = aStream;
    this.mStreamPos = 0;
  }

  StopProgram() 
  {
    return false;
  }

  IsEndOfStream() {
    return this.mStreamPos >= this.mStream.length;
  }

  Read() {
    if (this.IsEndOfStream()) {
      console.log("IntcodeIO input invalid index: " + this.mInputOffset + " " + this.mInput);
      return;
    }

    let input = this.mStream[this.mStreamPos++];
    //console.log("input<--" + input);
    return input;
  }

  Write(aValue) {
    this.mStream.push(aValue);
  }

  Get() {
    return this.mStream;
  }

  Clear() {
    this.mStream = [];
  }

  Print() {
    console.log(this.mStream);
  }
}

function SplitInstruction(aValue) {
  let codes = [];
  while (aValue > 0) {
    codes.unshift(aValue % 10);
    aValue = Math.floor(aValue / 10);
  }

  for (let j = codes.length; j < 5; j++)
    codes.unshift(0);

  return codes;
}

const NO_ERROR = 0;
const ERROR_INPUT_NEEDED = 1;
const ERROR_PROGRAM_HALTED = 2;
const ERROR_INVALID_INSTURCTION = 3;
const ERROR_PROGRAM_STOPPED = 4;
const ERROR_BREACK_OCCURED = 5;

class IntcodeProgram {

  constructor(aInst, aInputStream, aOutputStream) {
    this.mInst = util.CopyObject(aInst);
    this.mInputStream = aInputStream;
    this.mOutputStream = aOutputStream;
    this.mInstPos = 0;
    this.mErrorCode = 0;
    this.mRelativeBase = 0;
    this.mBreakInterval = 0;
  }

  SetBreakInterval(aInterval) 
  {
    this.mBreakInterval = aInterval;
  }

  GetValueAtMemPos(aPos) 
  {
    return this.mInst[aPos];
  }

  SetValueAtMemPos(aPos, aValue)
  {
    this.mInst[aPos] = aValue;
  }

  GetErrorCode() {
    return this.mErrorCode;
  }

  ClearError() 
  {
    this.mErrorCode = NO_ERROR;
  }

  CheckMemoryAddress(aMemAddress)
  {
    if (aMemAddress >= this.mInst.length)
      this.IncreaseMemory(aMemAddress + 1 - this.mInst.length);
  }

  IncreaseMemory(aAmount) 
  {
    for (let i = 0; i < aAmount; i++)
      this.mInst.push(0);
  }

  GetParam(aMode, aPos) {

    let memAddress = 0;
    if (aMode == 0)
      memAddress = this.mInst[aPos];
    else if (aMode == 1)
      memAddress = aPos;
    else if (aMode == 2)
      memAddress = this.mRelativeBase + this.mInst[aPos];
    else
    {
      console.log("Invalid parameter mode: " + aMode);
      return 0;
    }

    this.CheckMemoryAddress(memAddress);

    return this.mInst[memAddress];
  }

  StoreResult(aMode, aPos, aValue) {
    if ((aMode != 0) && (aMode != 2)) {
      console.log("Invalid param mode!");
      return false;
    }
  
    let relativeBase = 0;
    if (aMode == 2)
      relativeBase = this.mRelativeBase;
    
    let memAddress = relativeBase + this.mInst[aPos];

    this.CheckMemoryAddress(memAddress);

    this.mInst[memAddress] = aValue;
    return true;
  }

  Run() {

    if (((this.mErrorCode == ERROR_INPUT_NEEDED) && !this.mInputStream.IsEndOfStream()) || 
        (this.mErrorCode == ERROR_BREACK_OCCURED))
      this.mErrorCode = NO_ERROR;

    if (this.mErrorCode != NO_ERROR)
      return this.mErrorCode;

    let instructionCouter = 0;
    for (let i = this.mInstPos; i < this.mInst.length;) 
    {
      if (this.mBreakInterval > 0)
      {
        if ((instructionCouter > this.mBreakInterval)) 
        {
          this.mInstPos = i;
          this.mErrorCode = ERROR_BREACK_OCCURED;
          return;
        } 
        else
          instructionCouter ++;
      }

      let detail = SplitInstruction(this.mInst[i]);

      let param3Mode = detail[0];
      let param2Mode = detail[1];
      let param1Mode = detail[2];

      let opCode = detail[3] * 10 + detail[4];

      if (opCode == 1) {
        let param1 = this.GetParam(param1Mode, i + 1);
        let param2 = this.GetParam(param2Mode, i + 2);

        if (!this.StoreResult(param3Mode, i + 3, param1 + param2))
          break;

        i += 4;
      }
      else if (opCode == 2) {
        let param1 = this.GetParam(param1Mode, i + 1);
        let param2 = this.GetParam(param2Mode, i + 2);

        if (!this.StoreResult(param3Mode, i + 3, param1 * param2))
          break;

        i += 4;
      }
      else if (opCode == 3) {
        if (this.mInputStream.IsEndOfStream())
        {
          this.mInstPos = i;
          this.mErrorCode = ERROR_INPUT_NEEDED;
          return 1;
        }
        if (!this.StoreResult(param1Mode, i + 1, this.mInputStream.Read()))
          break;

        i += 2;
      }
      else if (opCode == 4) {
        let param1 = this.GetParam(param1Mode, i + 1);
        this.mOutputStream.Write(param1);

        i += 2;
      }
      else if (opCode == 5) {
        let param1 = this.GetParam(param1Mode, i + 1);
        let param2 = this.GetParam(param2Mode, i + 2);
        if (param1) {
          i = param2;
        }
        else
          i += 3;
      }
      else if (opCode == 6) {
        let param1 = this.GetParam(param1Mode, i + 1);
        let param2 = this.GetParam(param2Mode, i + 2);
        if (param1 == 0) {
          i = param2;
        }
        else
          i += 3;
      }
      else if (opCode == 7) {
        let param1 = this.GetParam(param1Mode, i + 1);
        let param2 = this.GetParam(param2Mode, i + 2);

        if (!this.StoreResult(param3Mode, i + 3, (param1 < param2) ? 1 : 0))
          break;

        i += 4;
      }
      else if (opCode == 8) {
        let param1 = this.GetParam(param1Mode, i + 1);
        let param2 = this.GetParam(param2Mode, i + 2);

        if (!this.StoreResult(param3Mode, i + 3, (param1 == param2) ? 1 : 0))
          break;

        i += 4;
      }
      else if (opCode == 9)
      {
        let param1 = this.GetParam(param1Mode, i + 1);
        this.mRelativeBase += param1;

        i += 2;
      }
      else if (opCode == 99) 
      {
        this.mErrorCode = ERROR_PROGRAM_HALTED;
        break;
      }
      else {
        console.log("Invalid instruction!");
        this.mErrorCode = ERROR_INVALID_INSTURCTION;
        break;
      }
    }

    return this.mErrorCode;
  }
}

module.exports = {
  ERROR_PROGRAM_HALTED,
  IntcodeProgram,
  IntcodeIOStream
}
