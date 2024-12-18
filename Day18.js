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

function CreateMap(aWidth, aHeight, aBytes, aCount) 
{
  let map = [];
  for (let i = 0; i < aHeight; i++) {
    let line = [];
    for (let j = 0; j < aWidth; j++)
      line.push('.');
    map.push(line);
  }

  for (let i = 0; i < aCount; i++)
    map[aBytes[i][1]][aBytes[i][0]] = '#'

  //matrix.CreateMatrix(map).Print("");

  return map;
}

function Simulate2(aBytes) 
{
  for (let i = 1024; i < aBytes.length; i++)
  {
    let map = CreateMap(71, 71, aBytes, i);
   
    let ret = FindShortesDist(map, EncodeNode(0, 0), EncodeNode(70, 70));

    if (ret.path.length == 0) {
      return aBytes[i - 1];
    }
  }

  return [0, 0];
}

let bytes = util.MapInput("./Day18Input.txt", (aElem) => {
    return aElem.split(",").map((aElem)=>{ 
      return parseInt(aElem);
    });
 }, "\r\n");

let map = CreateMap(71, 71, bytes, 1024);

let ret = FindShortesDist(map, EncodeNode(0, 0), EncodeNode(70, 70));

console.log(ret);

console.log(Simulate2(bytes));
