const util = require('./Util.js');

function FindPathSteps(aMap, aStart) {
  let x = aStart.x;
  let y = aStart.y;

  let pathMap = new Map();

  pathMap.set(x + "_" + y, {c: 1, dx: 0, dy: -1 });

  let dirX = 0;
  let dirY = -1;
  while (1)
  {
    let nextX = x + dirX;
    let nextY = y + dirY;

    if ((nextX < 0) || (nextX >= aMap[0].length) || 
        (nextY < 0) || (nextY >= aMap.length))
      break;  

    if (aMap[nextY][nextX] == "#")
    {
      if (dirY == -1)
      {
        dirX = 1;
        dirY = 0;
      }
      else if (dirY == 1)
      {
        dirX = -1;
        dirY = 0;
      } 
      else if (dirX == -1)
      {
        dirX = 0;
        dirY = -1;
      } 
      else
      {
        dirX = 0;
        dirY = 1;
      }
    }
    else
    {
      x = nextX;
      y = nextY;

      let key = x + "_" + y;

      let cc = 0;
      if (pathMap.has(key)) {
        let rr = pathMap.get(key); 
        cc = rr.c;

        if (rr.dx == dirX && rr.dy == dirY)
          return {loop: true, size: pathMap.size};
      } 

      pathMap.set(key, {c: cc + 1, dx: dirX, dy: dirY });
    }
  }

  return {loop: false, size: pathMap.size};
}

function FindLoopCount(aMap, aStart) {

  let loopCount = 0;
  for (let i = 0; i < aMap.length; i++)
    for(let j = 0; j < aMap[i].length; j++)
    {
      if (i == aStart.y && j == aStart.x)
        continue;

      let newMap = util.CopyObject(aMap);
      newMap[i][j] = "#";

      let ret = FindPathSteps(newMap, aStart);

      if (ret.loop)
        loopCount ++;
    }

  return loopCount;
}

let start = {x: 0, y: 0};

let map = util.MapInput("./Day6Input.txt", (aElem, aY) => {

  return aElem.split("").map((aElem, aX)=>{
    if (aElem == "^") {
      start.x = aX;
      start.y = aY;
      return '.';
    }

    return aElem;
  });

}, "\r\n");

console.log(FindPathSteps(map, start).size);

console.log(FindLoopCount(map, start));
