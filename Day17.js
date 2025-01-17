const util = require('./Util.js');

function GetComboOperand(aOperand, aRegs) 
{
  if (aOperand >= 0 && aOperand <= 3)
  {
    return aOperand;  
  }
  else if (aOperand == 4)
  {
    return aRegs.A;
  }
  else if (aOperand == 5)
  {
    return aRegs.B;
  }
  else if (aOperand == 6)
  {
    return aRegs.C;
  }
  else 
  { 
    console.log("Invalid adv operand!");
    return 0;
  }   
}

function AddToListing(aListing, aStr) 
{
  if (aListing.o.length > 0)
    aListing.o += "\n";
  aListing.o += aStr;
}

function ExecInst(aOpcode, aOperand, aRegs, aOutput, aListing) 
{
  if (aOpcode == 0)
  {
    let operand = GetComboOperand(aOperand, aRegs);
    let divisor = Math.pow(2, operand)
    AddToListing(aListing , "A = " + aRegs.A + " / " + divisor);
    aRegs.A = Math.floor(aRegs.A / divisor);
  }
  else if (aOpcode == 1)
  {
    AddToListing(aListing , "B = " + aRegs.B + " XOR " + aOperand);
    aRegs.B = aRegs.B ^ aOperand;
  }
  else if (aOpcode == 2)
  {
    let operand = GetComboOperand(aOperand, aRegs);
    AddToListing(aListing , "B = " + operand + " % 8");
    aRegs.B = operand % 8;
  }
  else if (aOpcode == 3)
  {
    if (aRegs.A != 0)
    {
      AddToListing(aListing, "jmp " + aOperand);
      return aOperand;
    }
  }
  else if (aOpcode == 4)
  {
    AddToListing(aListing, "B = " + aRegs.B + " XOR " + aRegs.C);
    aRegs.B = Number(BigInt(aRegs.B) ^ BigInt(aRegs.C));
  }
  else if (aOpcode == 5)
  {
    let operand = GetComboOperand(aOperand, aRegs);
    let vv = operand % 8;
    aOutput.push(vv);
    AddToListing(aListing, operand + " % 8");
    AddToListing(aListing, "output: " + vv);
  }
  else if (aOpcode == 6)
  {
    let operand = GetComboOperand(aOperand, aRegs);
    let divisor = Math.pow(2, operand);
    AddToListing(aListing , "B = " + aRegs.A + " / " + divisor);
    aRegs.B = Math.floor(aRegs.A / divisor);
  }
  else if (aOpcode == 7)
  {
    let operand = GetComboOperand(aOperand, aRegs);
    let divisor = Math.pow(2, operand);
    AddToListing(aListing , "C = " + aRegs.A + " / " + divisor);
    aRegs.C = Math.floor(aRegs.A / divisor);
  }
  else
    console.log("Invalid opcode: " + aOpcode);

  return -1;
}

function IsEqual(aA, aB) 
{
  if (aA.length != aB.length)
    return false;

  for (let i = 0; i < aA.length; i++)
    if (aA[i] != aB[i])
      return false;
  
  return true;
}

function RunProgram(aProgram, aRegA)
{
  let regs = {A: aRegA, B: 0, C: 0};

  let i = 0;
  let output = [];
  let listing = {o: ""};
  while (1)
  {
    let next = ExecInst(aProgram[i], aProgram[i + 1], regs, output, listing);
    if (next >= 0)
      i = next;
    else 
      i += 2;
    
    if (i >= aProgram.length)
      break;
  }

  //console.log(listing.o);

  return output;
}

function RunCompiledProgram(aRegA) {
  let b = aRegA % 8;
  b = b ^ 5;
  let c = Math.floor(aRegA / Math.pow(2, b));
  b = b ^ 6;
  b = b ^ c;
  let val = b % 8;
  
  return [val, c];
}

function Simulate(aProgram) 
{
  for (let i = 0; i < 1000 ; i++) {

  let a = i;
  let output = [];
  //while (1) {

    let vv = RunCompiledProgram(a);

    if (vv == 5) 
      console.log(i + " " + (i % 8));

  //  output.push(vv);
    //a = Math.floor(a / 8);

   // if (a == 0)
   //   break;
 // }

 // console.log(i + " => " + output);

 // if (IsEqual(output, aProgram))
  //  break;
  }
}

function ComputeAll(aProgram, aIndex, aMults, aTotal) 
{
  if (aIndex == aMults.length)
  {
    a = aMults.reduce((pv, cv, i) => { return pv + cv * 8 ** i;}, 0);

    let output = RunProgram(aProgram, a);

    //console.log(output);
    //console.log(aMults);

    if (IsEqual(output, aProgram)) {
       console.log("RegA:" + a);
    }
    else
    {
      let ll = Math.min(output.length, aProgram.length);
      let part = [];
      let k = aProgram.length - 1;
      for (let i = ll - 1; i >= 0; i--) {
        if (output[i] == aProgram[k])
          part.unshift(output[i]);
        else
          break;
        k--;
      }

      if (part.length > aTotal.max.length)
      {
        aTotal.max = part;
        aTotal.mults = aMults.slice(-1 * Math.min(part.length - 2, 1));
        aTotal.newMax = true;
        console.log(part);
        console.log(aTotal.mults);
      }
    }

    return;
  }

  if (aTotal.newMax)
    return;

  if (aMults[aIndex] == -1) {
    for (let i = 0; i < 8; i++)
    {
      let newMults = [...aMults];
      newMults[aIndex] = i;
      ComputeAll(aProgram, aIndex + 1, newMults, aTotal);
    }
  }
  else
  {
    let newMults = [...aMults];
    ComputeAll(aProgram, aProgram.length, newMults, aTotal);
  }
}

function ComputeAll2(aProgram, aMults) {

  let s = 1;
  let a = 0;
  for (;;)
  {
    let output = RunProgram(aProgram, a);

    if (IsEqual(output, aProgram))
    {
      return a;
    }
    else if (IsEqual(output, aProgram.slice(-1 * s)))
    {
      aMults.push(a);
      a *= 8;
      s++;
    }
    else 
      a++;
  }
}

function FindRegValue(aProgram) 
{
  let total = { max: [], mults: [], newMax: false };

  while (1) 
  {
    const mults = Array(aProgram.length).fill(-1);

    if (total.max.length > 0)
      {
        let k = mults.length - 1;
        for (let j = total.mults.length - 1; j >= 0; j--)
        {
          mults[k] = total.mults[j];
          k--;
        }
      }

    total.newMax = false;
   ComputeAll(aProgram, 0, mults, total);
  }
}

let regs = {A: 0, B: 0, C: 0 };
let program = [];

util.MapInput("./Day17Input.txt", (aElem, aIndex) => {

  if (aIndex == 0) {
    flatRegs = aElem.split("\r\n");

    regs.A = parseInt(flatRegs[0].split(": ")[1]);
    regs.B = parseInt(flatRegs[1].split(": ")[1]);
    regs.C = parseInt(flatRegs[2].split(": ")[1]);
  }
  else
  {
    program = aElem.split(": ")[1].split(",").map((bb)=>{
      return parseInt(bb);
    })  
  }
 }, "\r\n\r\n");

 //console.log(regs);
 //console.log(program);

 console.log(RunProgram(program, regs.A).toString());

//console.log(RunProgram(program, 117440));

//const mults2 =[ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 3, 3, 0, 3 ];

//const mults2 = [-1, -1, -1, 4, 2, 4, 4, 3, 3, 6, 4, 0, 3, 3, 0, 3];

//let total = { max: [] };

//let cache = new Map();

//ComputeAll(program, 0, mults2, total, cache);

//FindRegValue(program);

const mults2 = Array(program.length).fill(-1);

console.log(ComputeAll2(program, mults2));
