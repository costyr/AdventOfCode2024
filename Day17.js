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
    aRegs.B = aRegs.B ^ aRegs.C;
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

function RunProgram(aProgram, aA)
{
  let regs = {A: aA, B: 0, C: 0};

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

function FindRegValue(aProgram) 
{
  let i = 1;//17592186044416;
  while (1) 
  {
    let regs = { A: i, B: 0, C: 0 };
    let oo = RunProgram(aProgram, i);

    console.log(i + "=>" + oo);

    if (IsEqual(aProgram, oo))
      break;

    /*let x = i % 8;
    x = x ^ 5;
    i = i * Math.pow(2, x);*/
    //if ( oo.length == aProgram.length)
    //  i++
    //else
      i += 6 * 8 ** 3;  
  }
  return i;
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

 console.log(regs);
 console.log(program);

 regs.A = 0 + 0 * 8 ** 0 + 1 * 8 ** 1 + 2 * 8 ** 2;

 //console.log(RunProgram(program, regs));

 //Simulate(program);

 console.log(FindRegValue(program));

 //for (let i = 0; i < 8; i++)
 //  console.log(RunCompiledProgram(3 * 8 + i));

 /*let a = 0, output = RunProgram(program, a);
        const mults = Array(program.length).fill(0);
        let quine = output;
        for (let i = program.length - 1; i >= 0; i--) { // Work right to left
            while (output.length < program.length || quine[i] !== program[i]) {
                mults[i]++; // change element N by multiplying by 8 ** N
                a = mults.reduce((pv, cv, i) => pv + cv * 8 ** i);
                output = RunProgram(program, a);
                quine = output;
            }
        }

console.log(a);

console.log(RunProgram(program, a));*/
