const util = require('./Util.js');
const alg = require('./Dijkstra.js');

let kNumericKeypad = [['7', '8', '9'],
                      ['4', '5', '6'],
                      ['1', '2', '3'],
                      [' ', '0', 'A']];

let kDirectionalKeypad = [[' ', '^', 'A'],
                          ['<', 'v', '>']];

function ToHashMap(aMap) {
  let hashMap = new Map(); 
  for (let i = 0; i < aMap.length; i++)
    for (let j = 0; j < aMap[i].length; j++)
      hashMap.set(aMap[i][j], [j, i]);
  return hashMap;
}

let kDirectionalKeypadMap = ToHashMap(kDirectionalKeypad);

function ComputePathLength(aHashMap, aPath) {
  let bb = 0;
  for (let i = 0; i < aPath.length - 1; i++)
  {
    let p1 = aHashMap.get(aPath[i]);
    let p2 = aHashMap.get(aPath[i + 1]);
    
    let dist = Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

    bb += dist;
  }

  return bb;
}

function ComputeBestPath(aHashMap, aCodePaths, aStrict) {

  let min = Number.MAX_SAFE_INTEGER;
  let tt = new Array();
  for (let i = 0; i < aCodePaths.length; i++)
  {
    let dist = ComputePathLength(aHashMap, aCodePaths[i]);

    let ff = aStrict ? dist < min : dist <= min;
    if (ff) 
    {
      min = dist;

      if (aStrict)
        tt = [];

      tt.push(aCodePaths[i]);
    }
  }

  return tt;
}

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
  let gg = 'A';
  gg += aCode.toString().replace(/,/g, "");

  if (aIndex >= gg.length) {
    aAllPaths.push(aPath);
    return;
  }

  let ll = [];

  for (let i = aIndex; i < gg.length; i++) {

    let key = gg[i - 1] + "_" +gg[i];

    let yy = new Array();
    if (aCache.has(key))
      yy = aCache.get(key)
    else {
      yy = FindSequence(aMap, gg[i - 1], gg[i]);

      aCache.set(key, yy);
    }

    if (yy.length > 1) {
      for (let j = 0; j < yy.length; j++) {
        let newPath = util.CopyObject(aPath);
        newPath += yy[j].toString().replace(/,/g, "");
        newPath += 'A';

        ComputeAllCodePaths(aMap, aCode, i + 1, newPath, aAllPaths, aCache);
      }
      return;
    }
    else {

      let rr = yy.length > 0 && yy[0].length > 0 ? yy[0].toString().replace(/,/g, "") : "";
      rr += 'A';
      
      aPath += rr;

      ll.push(rr.length);
    }
  }

  //console.log(ll);
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

  cache.set("^_^", [[]]);
  cache.set("^_v", [['v']]);
  cache.set("^_<", [['v', '<']]);
  cache.set("^_>", [['v', '>']]);
  cache.set("^_A", [['>']]);

  cache.set("v_^", [['^']]);
  cache.set("v_v", [[]]);
  cache.set("v_<", [['<']]);
  cache.set("v_>", [['>']]);
  cache.set("v_A", [['^', '>']]);

  cache.set("<_^", [['>', '^']]);
  cache.set("<_v", [['>']]);
  cache.set("<_<", [[]]);
  cache.set("<_>", [['>', '>']]);
  cache.set("<_A", [['>', '>', '^']]);

  cache.set(">_^", [['<', '^']]);
  cache.set(">_v", [['<']]);
  cache.set(">_<", [['<', '<']]);
  cache.set(">_>", [[]]);
  cache.set(">_A", [['^']]);

  cache.set("A_^", [['<']]);
  cache.set("A_v", [['<', 'v']]);
  cache.set("A_<", [['v', '<', '<']]);
  cache.set("A_>", [['v']]);
  cache.set("A_A", [[]]);

  for (let i = 0; i < aCodes.length; i++) {
    let gg = new Array();
    ComputeAllCodePaths(kNumericKeypad, aCodes[i], 1, [], gg, cache);

    let gg0 = ComputeBestPath(kDirectionalKeypadMap, gg, false);

    for (let k = 0; k < aCount; k++) {
      console.log(k + " " + gg0[0].length);
    let uu = [];
    for (let i = 0; i < gg0.length; i++) {
      ComputeAllCodePaths(kDirectionalKeypad, gg0[i], 1, "", uu, cache);
    }
    gg0 = uu;
  }

    let kk = [];
    for (let i = 0; i < gg0.length; i++)
      ComputeAllCodePaths(kDirectionalKeypad, gg0[i], 1, "", kk, cache);

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

let codes = util.MapInput("./Day21TestInput.txt", (aElem) => {
  return aElem.split("");
}, "\r\n");

console.log(codes);

//FindSequence(kNumericKeypad, '2', '9');

let cache = new Map();

/*let rr = new Map();
ComputeAllCodePaths(kDirectionalKeypad, ['v', 'v', 'v', 'A'], 1, [], rr, cache);

console.log(rr);

rr.clear();*/

/*let rr = [['>','^', '^', 'A']];

for (let i = 0; i < 25; i++) {

  console.log(i);

  let bb = [];
for (let j = 0; j < rr.length; j++)
{
  console.log("---------------------------------------------");
  ComputeAllCodePaths(kDirectionalKeypad, rr[j], 1, [], bb, cache);
  //console.log(bb);
}

rr = bb;
}*/

console.log(ComputeTotalComplexity(codes, 25));

/*let gg = new Array();
for (let i = 0; i < 1200000000; i++)
  gg.push('A');*/

