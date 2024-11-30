
class Graph {
  constructor() {
    this.mGraph = [];
  }

  SetNeighbours(aNodeId, aNeighbours) {
    this.mGraph[aNodeId] = aNeighbours;
  }

  AddNeighbour(aNodeId, aNeighbour) {
    if (this.mGraph[aNodeId] == undefined)
      this.mGraph[aNodeId] = [];
    this.mGraph[aNodeId].push(aNeighbour);
  }

  GetNeighbours(aNodeId) {
    return this.mGraph[aNodeId];
  }

  GetGraph() {
    return this.mGraph;
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {
    return aCurrentNode == aEndNodeId;
  }

  SetVisited(aState, aNode) {
    return aState.SetVisited(aNode);
  }

  IsVisited(aState, aNode) {
    return aState.IsVisited(aNode);
  }
}

class PriorityQueue {
  constructor(aStatNode) {
    this.mQueue = [];
    if (aStatNode != undefined)
      this.mQueue.push(aStatNode);
    this.mSortFunc = null;
    this.mQueueMap = new Map();
  }

  SetSortFunc(aSortFunc) {
    this.mSortFunc = aSortFunc;
  }

  Pop() {
    let top = this.mQueue.shift();
    this.mQueueMap.delete(top);
    return top;
  }

  Push(aNode) {
    if (this.mQueueMap.get(aNode) !== undefined)
      return;

    this.mQueue.push(aNode);
    this.mQueueMap.set(aNode, 1);
  }

  Sort() {
    if (this.mSortFunc)
      this.mQueue.sort(this.mSortFunc);
  }

  IsEmpty() {
    return (this.mQueue.length == 0);
  }
}

class NodeState {
  constructor() {
    this.mState = new Map();
  }

  GetId(aNode) {
    return JSON.stringify(aNode);
  }

  InitState(aNodeId) {

    if (this.mState.get(aNodeId) == undefined) {
      this.mState.set(aNodeId, { visited: false, dist: Number.MAX_SAFE_INTEGER });
    }
  }

  SetDist(aNodeId, aDist) {
    this.InitState(aNodeId);
    this.mState.get(aNodeId).dist = aDist;
  }

  GetDist(aNodeId) {
    if (this.mState.get(aNodeId) == undefined)
      return Number.MAX_SAFE_INTEGER;
    return this.mState.get(aNodeId).dist;
  }

  SetVisited(aNodeId) {
    this.InitState(aNodeId);
    this.mState.get(aNodeId).visited = true;
  }

  IsVisited(aNodeId) {
    if (this.mState.get(aNodeId) == undefined)
      return false;
    return this.mState.get(aNodeId).visited;
  }
}

function SortByDist(aDistMap, aElem1Id, aElem2Id) {
  let dist1 = aDistMap.GetDist(aElem1Id);
  let dist2 = aDistMap.GetDist(aElem2Id);

  if (dist1 < dist2)
    return -1;
  else if (dist1 > dist2)
    return 1;
  else
    return 0;
}

class Dijkstra {
  constructor(aGraph, aStateExtra) {
    this.mGraph = aGraph;
    this.mStateExtra = aStateExtra;
  }

  CreateQueueNode(aCurrentNode, aNeighbourId) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.CreateQueueNode(aCurrentNode, aNeighbourId);
    return aNeighbourId;
  }

  ComputeStateId(aCurrentNode, aNeighbourId) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.ComputeStateId(aCurrentNode, aNeighbourId);

    if (aNeighbourId == undefined)
      return aCurrentNode;
    return aNeighbourId;
  }

  SetStartState(aState, aStart) {
    if (this.mStateExtra != undefined) {
      this.mStateExtra.SetStartState(aState, aStart);
      return;
    }
    aState.SetDist(aStart, 0);
  }

  InitQueue(aQueue, aStart) {
    if (this.mStateExtra != undefined) {
      this.mStateExtra.InitQueue(aQueue, aStart);
      return;
    }
    aQueue.Push(aStart);
  }

  GetNodeId(aNode) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.GetNodeId(aNode);

    return aNode;
  }

  EndNodeReached(aCurrentNode, aEndNodeId) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.EndNodeReached(aCurrentNode, aEndNodeId);
    else if (this.mGraph.EndNodeReached != undefined)
      return this.mGraph.EndNodeReached(aCurrentNode, aEndNodeId);

    return aCurrentNode == aEndNodeId;
  }

  SetVisited(aState, aNode) {

    if (this.mGraph.SetVisited !== undefined)
      return this.mGraph.SetVisited(aState, aNode);

    return aState.SetVisited(aNode);
  }

  IsVisited(aState, aNode) {

    if (this.mGraph.IsVisited !== undefined)
      return this.mGraph.IsVisited(aState, aNode);

    return aState.IsVisited(aNode);
  }

  IsValidNeighbour(aCurrentNode, aNeighbourId) {
    if (this.mStateExtra != undefined)
      return this.mStateExtra.IsValidNeighbour(aCurrentNode, aNeighbourId);
    return true;
  }

  ComputePath(aStart, aEnd, aPath) {
    let startNodeStateId = this.ComputeStateId(aStart);
    let endNodeStateId = this.ComputeStateId(aEnd);

    let goodPath = [];
    let next = endNodeStateId;
    while (1) {
      goodPath.unshift(next);

      if (next == startNodeStateId)
        break;
      next = aPath[next];

      if (next === undefined)
        return [];
    }

    return goodPath;
  }

  FindShortestPath(aStart, aEnd) {
    let queue = new PriorityQueue();
    this.InitQueue(queue, aStart);

    let state = new NodeState();
    this.SetStartState(state, aStart);

    if (this.mStateExtra != undefined)
      queue.SetSortFunc(this.mStateExtra.SortByDist.bind(null, state))
    else
      queue.SetSortFunc(SortByDist.bind(null, state));

    let path = [];
    let endReached = false;
    while (!queue.IsEmpty()) {

      let currentNode = queue.Pop();

      let currentNodeStateId = this.ComputeStateId(currentNode);

      let currentDist = state.GetDist(currentNodeStateId);

      if (this.EndNodeReached(currentNode, aEnd)) {
        endReached = true;
        aEnd = currentNode;
        break;
      }

      let neighbours = this.mGraph.GetNeighbours(this.GetNodeId(currentNode));

      if (neighbours != undefined) {
        for (let i = 0; i < neighbours.length; i++) {
          let neighbour = neighbours[i];

          if (!this.IsValidNeighbour(currentNode, neighbour.id))
            continue;

          let neighbourStateId = this.ComputeStateId(currentNode, neighbour.id);

          if (this.IsVisited(state, neighbourStateId))
            continue;

          let estimateDist = currentDist + neighbour.cost;
          if (estimateDist < state.GetDist(neighbourStateId)) {
            path[neighbourStateId] = currentNodeStateId;
            state.SetDist(neighbourStateId, estimateDist);
          }

          queue.Push(this.CreateQueueNode(currentNode, neighbour.id));
        }
      }

      this.SetVisited(state, currentNodeStateId);
      queue.Sort();
    }

    if (!endReached)
      return { dist: 0, path: [] };

    let goodPath = this.ComputePath(aStart, aEnd, path);

    let endNodeStateId = this.ComputeStateId(aEnd);
    return { dist: state.GetDist(endNodeStateId), path: goodPath };
  }
}

module.exports = {
  NodeState,
  Graph,
  PriorityQueue,
  Dijkstra
}
