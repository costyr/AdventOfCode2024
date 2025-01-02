const util = require('./Util.js');
const matrix = require('./Matrix.js');

function FindKeys(aLocks) 
{
  let total = 0;
  for (let i = 0; i < aLocks.length; i++) {
    let key = aLocks[i];

    if (key[0][0] != '#')
      continue;

    for(let j = 0; j < aLocks.length; j++)
    {
      let lock = aLocks[j];

      if (lock[0][0] != '.')
        continue;

      let overlap = false;
      for (let k = 0; k < lock.length; k++) {
        for (let l = 0; l < lock[k].length; l++) {
          if (key[k][l] == '#' && 
              lock[k][l] == '#') 
          {
            overlap = true;          
            break;
          }
        }

        if (overlap)
          break;
      }

      if (!overlap) {
        console.log("\n\n" + i + " " + j);
        matrix.CreateMatrix(key).Print("");
        console.log("\n")
        matrix.CreateMatrix(lock).Print("");
        total++;
      }
    }
  }
  return total;
}

let locks = util.MapInput("./Day25Input.txt", (aElem) => {
  
    return aElem.split("\r\n").map((aa)=>{ 
      return aa.split("");  
    });

 }, "\r\n\r\n");

 for (let i = 0; i < locks.length; i++) {
   console.log("\n");
   matrix.CreateMatrix(locks[i]).Print("");
 }

console.log(FindKeys(locks));
