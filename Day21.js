const util = require('./Util.js');
const alg = require('./Dijkstra.js');

let kNumericKeypad = [['7', '8', '9'],
['4', '5', '6'],
['1', '2', '3'],
[' ', '0', 'A']];

let kDirectionalKeypad = [[' ', '^', 'A'],
['<', 'v', '>']];

function GetNodeCoord(aMap, aNodeId) {
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++) {
      if (aMap[i][j] == aNodeId)
        return [j, i];
    }

  return [-1, -1];
}

const kNeighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function DecodeNode(aNodeId) {
  return aNodeId.split("_").map((aElem) => { return parseInt(aElem); });
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
        y >= 0 && y < this.mGraph.length && this.mGraph[y][x] != ' ') {
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

  let ret = dijsk.FindShortestPath(aStart, aEnd, true);

  return ret;
}

function FindSequence(aMap, aStart, aEnd) {
  let start = GetNodeCoord(aMap, aStart);
  let end = GetNodeCoord(aMap, aEnd);

  let ret = FindShortesDist(aMap, EncodeNode(start[0], start[1]), EncodeNode(end[0], end[1]));

  //console.log(ret);

  let allDirPaths = [];

  for (let k = 0; k < ret.path.length; k++) {
    let dirPath = [];
    for (let i = 1; i < ret.path[k].length; i++) {
      let prev = DecodeNode(ret.path[k][i - 1]);
      let cr = DecodeNode(ret.path[k][i]);

      if (cr[1] == prev[1]) {
        if (cr[0] < prev[0])
          dirPath.push('<');
        else
          dirPath.push('>');
      }
      else if (cr[0] == prev[0]) {
        if (cr[1] < prev[1])
          dirPath.push('^');
        else
          dirPath.push('v');
      }
    }

    allDirPaths.push(dirPath);
    //console.log(dirPath);
  }

  return allDirPaths;
}

function ComputeAllCodePaths(aMap, aCode, aIndex, aPath, aAllPaths, aCache) {
  let gg = ['A', ...aCode];

  if (aIndex >= gg.length) {
    aAllPaths.push(aPath);
    return;
  }

  for (let i = aIndex; i < gg.length; i++) {

    let key = gg[i - 1] + "_" +gg[i];

    let yy = [];
    if (aCache.has(key))
      yy = aCache.get(key)
    else {
      yy = FindSequence(aMap, gg[i - 1], gg[i]);

      aCache.set(key, yy);
    }

    if (yy.length > 1) {
      for (let j = 0; j < yy.length; j++) {
        let newPath = [...aPath];
        newPath.push(...yy[j]);
        newPath.push('A');

        ComputeAllCodePaths(aMap, aCode, i + 1, newPath, aAllPaths, aCache);
      }
      return;
    }
    else {
      aPath.push(...yy[0]);
      aPath.push('A');
    }
  }

  aAllPaths.push(aPath);
}

function ComputeCodePath(aMap, aCode) {
  let gg = ['A', ...aCode];

  let pp = [];
  for (let i = 1; i < gg.length; i++) {
    pp.push(...FindSequence(aMap, gg[i - 1], gg[i]));
    pp.push('A');
  }

  //console.log(pp);

  return pp;
}

function ToArray(aDirs) 
{
  return aDirs.split("");
}

function ComputeTotalComplexity(aCodes, aCount) {
  let total = 0;
  let cache = new Map();
  for (let i = 0; i < aCodes.length; i++) {
    let gg = [];
    ComputeAllCodePaths(kNumericKeypad, aCodes[i], 1, [], gg, cache);

    let uu = [];
    for (let k = 0; k < aCount; k++) {
      //console.log(k + " " + gg.length);
    for (let i = 0; i < gg.length; i++)
      ComputeAllCodePaths(kDirectionalKeypad, gg[i], 1, [], uu, cache);
    gg = uu;
  }

    let kk = [];
    for (let i = 0; i < uu.length; i++)
      ComputeAllCodePaths(kDirectionalKeypad, uu[i], 1, [], kk, cache);

    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < kk.length; i++)
      min = Math.min(kk[i].length, min);

    let numCode = parseInt(aCodes[i].toString().replace(/,/g, "").substr(0, 3));

    console.log(min + " " + numCode);
    //console.log(kk.toString().replace(/,/g, ''));

    total += numCode * min;
  }

  return total;
}

let codes = util.MapInput("./Day21Input.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(codes);

//FindSequence(kNumericKeypad, '2', '9');

/*let rr = new Map();
let cache = new Map();
ComputeAllCodePaths(kDirectionalKeypad, ['v', 'v', 'v', 'A'], 1, [], rr, cache);

console.log(rr);

rr.clear();

rr.set(">^^A", 1);
rr.set("^>^A", 1);
rr.set("^^>A", 1);

for (let [key, value] of rr)
{
  let bb = new Map();
  ComputeAllCodePaths(kDirectionalKeypad, ToArray(key), 1, [], bb, cache);

  console.log("---------------------------------------------");
  console.log(bb);
}*/

console.log(ComputeTotalComplexity(codes, 1));
