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
    //console.log(jj.toString());

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

  console.log(jj.toString());


  let total = 0;
  for (let i = 0; i < jj.length; i++) 
  {
    if (jj[i] == -1)
    {
      console.log(i);
      break;
    }

    //console.log(i + "*" +  parseInt(jj[i]) + " = " + (i * parseInt(jj[i])));

    total += i * jj[i];
  }

  return total;
}

function Checksum2(aFileSystem) 
{
  let fileSystem = util.CopyObject(aFileSystem);
  let i = 0;

  let spaceMap = new Map();
  let maxSize = 0;
  for (;;)
  {
    if (i == fileSystem.length)
      break;

    if (fileSystem[i] != -1) 
    {
      i++
      continue;
    }

    let size = 0;
    let statIndex = i;
    while (fileSystem[i] == -1)
    {
      size++;
      i++;
    }

    if (size > 0)
    {
      let kk = spaceMap.has(size) ? spaceMap.get(size) : [];

      kk.push({ index: statIndex });

      maxSize = Math.max(maxSize, size);
      spaceMap.set(size, kk);      
    }
  }

  console.log(spaceMap);

  i = fileSystem.length - 1;
  for (;;)
  {
    if (i < 0)
      break;

    if (aFileSystem[i] == -1) 
    {
      i--
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

    //if (chunk.length > 0 && i > 0)
    //  i++;

    if (chunk.length > 0)
    {
      let sizeFound = chunk.length;
      let found = false;
      while (1) 
      {
        if (spaceMap.has(sizeFound)) {
          found = true;    
          break;
        }
        else 
          sizeFound++;

        if (sizeFound > maxSize)
          break;
      }

      if (found)
      {
        for (let x= 0; x < chunk.length; x++)
          fileSystem[startIndex - x] = -1;   

        let mem = spaceMap.get(sizeFound);
        
        let copyIndex = mem[0].index;

        for (let k = 0, j = copyIndex; k < chunk.length; k++, j++)
          fileSystem[j] = chunk[k];

        mem.splice(0, 1);

        if (mem.length == 0)
          spaceMap.delete(sizeFound);

        let newSize = sizeFound - chunk.length;
        if (newSize > 0)
        {
          let yy = spaceMap.has(newSize) ? spaceMap.get(newSize) : [];
          yy.push({index: copyIndex + chunk.length});
          
          yy.sort((a, b)=>{
            return (a.index - b.index);
          });

          spaceMap.set(newSize, yy);
        }

        for (let [key, value] of spaceMap)
          maxSize = Math.max(maxSize, key);
      }
    }
  }

  //console.log(spaceMap);

  //console.log(FileSystemToString(fileSystem));

  let total = 0;
  for (let i = 0; i < fileSystem.length; i++) 
  {
    if (fileSystem[i] == -1)
      continue;

    //console.log(i + "*" +  parseInt(jj[i]) + " = " + (i * parseInt(jj[i])));

    total += i * fileSystem[i];
  }

  console.log(total);
}

let files = util.MapInput("./Day9TestInput.txt", (aElem) => {

  return parseInt(aElem);

}, "");

console.log(files);

let gg = CreateFF(files);

console.log(gg);

console.log(Checksum(gg));

Checksum2(gg);
