const util = require('./Util.js');

function CreateFF(aFiles) {

  let ff = [];
  let cc = 0;
  for (let i = 0; i < aFiles.length; i++)
  {
    let hh = (i % 2 == 0) ? cc++ : -1;
    for (let j = 0; j < aFiles[i]; j++)
      ff.push(hh);           
  }
  
  return ff;
}

function PrintFileSystem(aFileSystem) 
{
  let str = "";
   for (let i = 0; i < aFileSystem.length; i++)
   {
     if (aFileSystem[i] == -1)
      str += ".";
     else
      str += "#";
   }

   return str;
}

function FileSystemToString(aFileSystem) 
{
  let str = "";
  for (let i = 0; i < aFileSystem.length; i++)
    if (aFileSystem[i] == -1)
      str += ".";
    else
      str += aFileSystem[i].toString();

  return str;
}

function Checksum(aFileSystem) {

  let jj = util.CopyObject(aFileSystem);
  let i = 0;
  let j = aFileSystem.length - 1;
  for (;;)
  {
    if (i >= j)
      break;

    if (jj[i] == -1) 
    {
      while (jj[j] == -1)
        j--;

      jj[i] = jj[j];
      jj[j] = -1;
      j--;
    }
    
    i++;
  }

  let total = 0;
  for (let i = 0; i < jj.length; i++) 
  {
    if (jj[i] == -1)
      break;

    total += i * jj[i];
  }

  return total;
}

function ComputeFreeSpace(aFileSystem) 
{
  let spaceMap = [];
  let size = 0;
  let statIndex = -1;
  for (let i = 0; i < aFileSystem.length; i++)
  {
    if (aFileSystem[i] != -1) {

      if (size > 0)
      {
        spaceMap.push({ index: statIndex, size: size });
        
        statIndex = -1;
        size = 0;
      }

      continue;
    }

    if (statIndex == -1)
      statIndex = i;
    
    size++;
  }

  return spaceMap;
}

function Checksum2(aFileSystem) 
{
  let fileSystem = util.CopyObject(aFileSystem);

  let spaceMap = ComputeFreeSpace(aFileSystem);

  i = aFileSystem.length - 1;
  for (;;)
  {
    if (i < 0)
      break;

    if (aFileSystem[i] == -1) 
    {
      i--;
      continue;
    }

    let bb = aFileSystem[i];
    
    let chunk = [];
    let startIndex = i;
    while (aFileSystem[i] == bb)
    {
      chunk.push(aFileSystem[i]);
      i--;
    }

    if (chunk.length > 0)
    {
      let found = false;
      let copyIndex = 0;
      for (let h = 0; h < spaceMap.length; h++) 
      {
        if (spaceMap[h].size >= chunk.length) {
          found = true;
          copyIndex = spaceMap[h].index;
          break;
        }      
      }

      if (found)
      {
        if (copyIndex < startIndex) {
        
        for (let x = 0; x < chunk.length; x++)
          fileSystem[startIndex - x] = -1;   

        for (let k = 0, j = copyIndex; k < chunk.length; k++, j++)
          fileSystem[j] = chunk[k];

        spaceMap = ComputeFreeSpace(fileSystem);
        }
      }
    }
  }

  let total = 0;
  for (let i = 0; i < fileSystem.length; i++) 
  {
    if (fileSystem[i] == -1)
      continue;

    total += i * fileSystem[i];
  }

  return total;
}

let files = util.MapInput("./Day9Input.txt", (aElem) => {

  return parseInt(aElem);

}, "");

let gg = CreateFF(files);

console.log(Checksum(gg));

console.log(Checksum2(gg));
