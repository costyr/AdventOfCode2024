const util = require('./Util.js');
const matrix = require('./Matrix.js');
const alg = require('./Dijkstra.js');

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function DecodeNode(aNodeId) {
  return aNodeId.split("_").map((aElem)=>{ return parseInt(aElem); });
}

function EncodeNode(aX, aY) {
  return aX + "_" + aY;
}

class SpecialGraph {
  constructor(aNodeMap) {
    this.mGraph = aNodeMap;
    this.mVisited = new Map();
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {

    let [x0, y0] = DecodeNode(aCurrentNode);

    let [x, y] = DecodeNode(aEndNodeId);

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

    let [x0, y0] = DecodeNode(aNodeId);

    let neighbours = [];

    for (let i = 0; i < kNeighbours.length; i++) {

      let x = x0 + kNeighbours[i][0];
      let y = y0 + kNeighbours[i][1];

      if (x >= 0 && x < this.mGraph[0].length && 
          y >= 0 && y < this.mGraph.length && 
          this.mGraph[y][x] != '#')
      {
        let newNode = EncodeNode(x, y);
        
        neighbours.push({ id: newNode, cost: 1 });
      }
    }

    return neighbours;
  }
}

function FindShortesDist(aMap, aStart, aEnd) {

  let graph = new SpecialGraph(aMap);

  let dijsk = new alg.Dijkstra(graph);

  let ret = dijsk.FindShortestPath(aStart, aEnd);

  return ret;
}

function FindNode(aMap, aNode) 
{
  for (let i = 0; i < aMap.length; i++)
    for(let j = 0; j < aMap[i].length; j++)
      if (aMap[i][j] == aNode)
        return [j, i];
  return [];
}

function ComputeBestCheats(aMap, aStart, aEnd, aBestScore) 
{
  let total = 0;
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
    {
      if (aMap[i][j] == '#')
      {
        aMap[i][j] = '.';
        let ret = FindShortesDist(aMap, EncodeNode(aStart[0], aStart[1]), EncodeNode(aEnd[0], aEnd[1]));
        if (aBestScore - ret.dist >= 100)
          total += 1;
        
        aMap[i][j] = '#';
      }
    }

  return total;
}

function CountCheats(aBestPath, aBestScore, aMaxCheat, aMaxCheat2) 
{
  let bestPath = [];
  for (let i = 0; i < aBestPath.length; i++)
    bestPath.push(DecodeNode(aBestPath[i]));

  let total = 0
  let total2 = 0;
  for (let i = 0; i < bestPath.length; i++)
  {
    let [x0, y0] = bestPath[i];
    for (let j = i + 1; j < aBestPath.length; j++)
    {
      let [x1, y1] = bestPath[j];

      let dist = Math.abs(x0 - x1) + Math.abs(y0 - y1);

      cheatDist = i + dist + aBestPath.length - j - 1;

      let saveDist = aBestScore - cheatDist;
      
      if (dist <= aMaxCheat && saveDist >= 100)
        total++;

      if (dist <= aMaxCheat2 && saveDist >= 100)
        total2++;
    }
  }

  return [total, total2];
}

let map = util.MapInput("./Day20Input.txt", (aElem) => {
    return aElem.split("");
 }, "\r\n");

//matrix.CreateMatrix(map).Print("");

let start = FindNode(map, 'S');

let end = FindNode(map, 'E');

let ret = FindShortesDist(map, EncodeNode(start[0], start[1]), EncodeNode(end[0], end[1]));

//console.log(ret);

console.log(CountCheats(ret.path, ret.dist, 2, 20));
