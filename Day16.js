const util = require('./Util.js');
const matrix = require('./Matrix.js');
const alg = require('./Dijkstra.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function DecodeNode(aNodeId) {
  return aNodeId.split("_").map((aElem)=>{ return parseInt(aElem); });
}

function EncodeNode(aX, aY, aDirX, aDirY) {
  return aX + "_" + aY + "_" + aDirX + "_" + aDirY;
}

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
    this.mVisited = new Map();
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {

    let [x0, y0, dirX, dirY] = DecodeNode(aCurrentNode);

    let [x, y, dir2X, dir2Y] = DecodeNode(aEndNodeId);

    if (x0 == x && y0 == y)
      return true;

    return false;
  }

  SetVisited(aState, aNode) {
    aState.SetVisited(aNode);
  }


  IsVisited(aState, aNode) {
    return aState.IsVisited(aNode);
  }

  GetNeighbours(aNodeId) {

    let [x0, y0, dirX, dirY] = DecodeNode(aNodeId);

    let neighbours = [];

    for (let i = 0; i < kNeighbours.length; i++) {

      let x = x0 + kNeighbours[i][0];
      let y = y0 + kNeighbours[i][1];

      if (x >= 0 && x < this.mGraph[0].length && 
          y >= 0 && y < this.mGraph.length && 
          this.mGraph[y][x] != '#')
      {
        let newNode = EncodeNode(x, y, kNeighbours[i][0], kNeighbours[i][1]);

        let cost = (dirX == kNeighbours[i][0]) && (dirY == kNeighbours[i][1]) ? 1 : ((dirX != kNeighbours[i][0] && dirY == kNeighbours[i][1]) || 
                                                                                     (dirX == kNeighbours[i][0] && dirY != kNeighbours[i][1])) ? 2001 : 1001;
        
        neighbours.push({ id: newNode, cost: cost });
      }
    }

    return neighbours;
  }
}

function FindNode(aMap, aNode) 
{
  for (let i = 0; i < aMap.length; i++)
    for(let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == aNode)
        return [j, i];
  return [];
}

function FindShortesDist(aMap, aStart, aEnd) {

  let graph = new SpecialGraph(aMap);

  let dijsk = new alg.Dijkstra(graph);

  let ret = dijsk.FindShortestPath(aStart, aEnd);

  //PrintPath(aMap, ret.path);
  return ret;
}

function PrintPath(aMap, aPath) 
{
  let mm = util.CopyObject(aMap);
  
  for (let i = 0; i < aPath.length; i++) 
  {
    let [x, y, dirX, dirY] = DecodeNode(aPath[i]);
    
    let ss = 'v';
    if (dirX == 0 && dirY == -1)
      ss = '^';
    else if (dirX == -1 && dirY == 0)
      ss = '<';
    else if (dirX == 1 && dirY == 0)
      ss = '>';

    mm[y][x] = ss;
  }

  matrix.CreateMatrix(mm).Print("");
}

function IsOnBestPath(aMap, aStart, aEnd, aBestCost, aX, aY, aCache) 
{
  let start = EncodeNode(aStart[0], aStart[1], 1, 0);
  let end = EncodeNode(aEnd[0], aEnd[1], 0, 1);

  let midNode0 = EncodeNode(aX, aY, 0, -1); 
  let ret = FindShortesDist(aMap, start, midNode0);

  if (ret.dist >= aBestCost)
    return false;

  let midNode = ret.path[ret.path.length - 1];

  let ret2 = FindShortesDist(aMap, midNode, end); 

  let bb = ret.dist + ret2.dist;

  if (bb == aBestCost) {
    AddPathToCache(aCache, ret.path);
    AddPathToCache(aCache, ret2.path);
    return true;
  }

  return false;
}

function AddPathToCache(aCache, aPath) 
{
  for (let i = 0; i < aPath.length; i++)
  {
    let [x, y, dirX, dirY] = DecodeNode(aPath[i]);

    let key = x + "_" + y; 

    aCache.set(key, 1);
  }
}

function CountBestTiles(aMap, aStart, aEnd, aBestCost, aCache) {

  let bestCount = 2;
  let bestPoints = [];
  for (let i = 0; i < aMap.length; i++) {

    console.log(i + " " + aCache.size);

    for (let j = 0; j < aMap[i].length; j++)
    {
      if (j == aStart[0] && i == aStart[1] || 
          j == aEnd[0] && i == aEnd[1])
        continue;

      if (aMap[i][j] == '#')
        continue;

      let key = j + "_" + i;
      
      if (aCache.has(key))
        continue;

      if (IsOnBestPath(aMap, aStart, aEnd, aBestCost, j, i, aCache)) {
         bestCount ++;
        bestPoints.push([j, i]);
      }
    }
  }

    let mm = util.CopyObject(aMap);
  
    for (let i = 0; i < bestPoints.length; i++) 
    {
      mm[bestPoints[i][1]][bestPoints[i][0]] = 'O';
    }
  
    matrix.CreateMatrix(mm).Print("");

    return aCache.size;
}

let map = util.MapInput("./Day16Input.txt", (aElem) => {
    return aElem.split("");
 }, "\r\n");

matrix.CreateMatrix(map).Print("");

let start = FindNode(map, 'S');

let end = FindNode(map, 'E');

console.log(start + " " + end);

let ret = FindShortesDist(map, EncodeNode(start[0], start[1], 1, 0), EncodeNode(end[0], end[1], 0, -1));

console.log(ret);

let cache = new Map();

AddPathToCache(cache, ret.path);

console.log(CountBestTiles(map, start, end, ret.dist, cache));
