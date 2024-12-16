const util = require('./Util.js');
const matrix = require('./Matrix.js');

let kDirMap = new Map([['>', [1,  0]], 
                       ['<', [-1, 0]], 
                       ['^', [0, -1]],
                       ['v', [0, 1 ]]]);

function GetDir(aSymbol) 
{
  return kDirMap.get(aSymbol);
}

function GetNextPos(aRobotPos, aDir) 
{
  let nextPos = GetDir(aDir);

  let x = aRobotPos[0] + nextPos[0];
  let y = aRobotPos[1] + nextPos[1];

  return [x, y];
}

function GetNext(aMap, aRobotPos, aDir) 
{
  let nextPos = GetNextPos(aRobotPos, aDir);

  return aMap[nextPos[1]][nextPos[0]];
}

function MoveRobot(aMap, aRobotPos, aDir) 
{
  let next = GetNext(aMap, aRobotPos, aDir);

  if (next == '#')
    return;

  if (next == '.')
  {
     let nextPos = GetNextPos(aRobotPos, aDir);
     aRobotPos[0] = nextPos[0];
     aRobotPos[1] = nextPos[1];
     return;
  }
  else
  {
    let dir = GetDir(aDir);

    let nextPos = GetNextPos(aRobotPos, aDir);

    let x0 = nextPos[0];
    let y0 = nextPos[1];
    let toMove = [[x0, y0]];

    let x = 0;
    let y = 0;
    while(1)
    {
      x = x0 + dir[0];
      y = y0 + dir[1];

      if (aMap[y][x] != 'O')
        break;

      toMove.push([x, y]);

      x0 = x;
      y0 = y;
    }

    if (aMap[y][x] == '.')
    {
      aMap[y][x] = 'O';
      aMap[nextPos[1]][nextPos[0]] = '.';

      aRobotPos[0] = nextPos[0];
      aRobotPos[1] = nextPos[1];
    }
  }
}

function Simulate(aMap, aRobotPos, aMoves) 
{
  let gg = util.CopyObject(map);
  let mm = matrix.CreateMatrix(gg)
  mm.SetValue(aRobotPos[1], aRobotPos[0], '@');
  mm.Print("");

  for (let i = 0; i < aMoves.length; i++) 
  {
    console.log(i + " " + aMoves[i]);
    MoveRobot(aMap, aRobotPos, aMoves[i]);

    let gg = util.CopyObject(map);
    let mm = matrix.CreateMatrix(gg)
    mm.SetValue(aRobotPos[1], aRobotPos[0], '@');
    mm.Print("");
  }

  let total = 0;
  for (let y = 0; y < aMap.length; y++)
    for (let x = 0; x < aMap[y].length; x++)
      if (aMap[y][x] == 'O')
        total += 100 * y + x;
      
  return total;
}

function CreateMap2(aMap, aRobotPos) 
{
  let map = [];
  for (let i = 0; i < aMap.length; i++)
  {
    let line = [];
    for (let j = 0; j < aMap[i].length; j++)
    {

      if (i == aRobotPos[1] && j == aRobotPos[0])
      {
        line.push("@");
        line.push(".");
        continue;
      }

      if (aMap[i][j] == '#') {
        line.push("#");
        line.push("#");
      }
      else if (aMap[i][j] == "O")
      {
        line.push("[");
        line.push("]");
      }
      else
      {
        line.push(".");
        line.push(".");
      }
    }
    map.push(line);
  }
  return map;    
}

function ComputeRobotPos(aMap) 
{
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == "@")
        return [j, i];
  
  return [];
}

function MoveBoxesVert(aMap, aMinX, aMaxX, aY, aDir) 
{
  let canMove = true;
  let hasBoxes = false;
  let y = aY + aDir;

  let minX = aMinX;
  let maxX = aMaxX;
  for (let i = aMinX; i <= aMaxX; i++)
    if (aMap[y][i] != '.') {
      canMove = false;

      if (aMap[y][i] == '[' || aMap[y][i] == ']') {
        hasBoxes = true;

        minX = Math.min(minX, i);
        maxX = Math.max(x, maxX);
      }
    }

  if (canMove)
  {
    for (let i = aMinX; i < aMaxX; i++) {
      aMap[y][i] = aMap[aY][i];
      aMap[aY][i] = '.';
    }

    return true;
  }
  else
  {
    if (hasBoxes)
    {
      let moved = MoveBoxesVert(minX, maxX, aY + aDir, aDir);

      if (moved) {
        for (let i = aMinX; i < aMaxX; i++) {
          aMap[y][i] = aMap[aY][i];
          aMap[aY][i] = '.';
        }
  
        return true;
      }
    }

    return false;
  }
}

function MoveRobot2(aMap, aRobotPos, aDir) 
{
  let next = GetNext(aMap, aRobotPos, aDir);

  if (next == '#')
    return;

  if (next == '.')
  {
     let nextPos = GetNextPos(aRobotPos, aDir);
     aRobotPos[0] = nextPos[0];
     aRobotPos[1] = nextPos[1];
     return;
  }
  else
  {
    let dir = GetDir(aDir);

    let nextPos = GetNextPos(aRobotPos, aDir);

    if (aDir == '^' || aDir == 'v')
    {
      let minX = next == '[' ? nextPos[0] : nextPos[0] - 1;
      let maxX = next == '[' ? nextPos[0] + 1 : nextPos[0];

      let moved = MoveBoxesVert(aMap, minX, maxX, nextPos[1], aDir == '^' ? -1 : 1);

      if (moved) {
        aRobotPos[0] = nextPos[0];
        aRobotPos[1] = nextPos[1];
      }
    }
  }
}

let map = [];
let map2 = [];
let moves = [];
let start = [];

util.MapInput("./Day15TestInput.txt", (aElem, aIndex) => {

 if (aIndex == 0)
   map = aElem.split("\r\n").map((aa, aY)=>{
    return aa.split("").map((bb, aX) => {
      if (bb == "@") {
        start[0] = aX;
        start[1] = aY;
        return '.';
      }
      return bb;
    });
  })
  else
    aElem.split("\r\n").map((bb)=>{
      bb.split("").map((cc)=>{
        moves.push(cc);
      })
  })

}, "\r\n\r\n");

matrix.CreateMatrix(map).Print("");

console.log(moves);

console.log(start);

map2 = CreateMap2(map, start);

let start2 = ComputeRobotPos(map2);

console.log(Simulate(map, start, moves));

console.log(start2);

matrix.CreateMatrix(map2).Print("");
