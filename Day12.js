const util = require('./Util.js');
const matrix = require('./Matrix.js');

const kNeighbours = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function IsInMap(aX, aY, aMap) 
{
  if (aX >= 0 && aX < aMap[0].length && aY >= 0 && aY < aMap.length)
    return true;
  return false;
}

function FindPoint(aX, aY, aRegion) 
{
  for (let i = 0; i < aRegion.length; i++)
    if (aRegion[i].x == aX && aRegion[i].y == aY)
      return i;
  return -1;
}

function RemovePoint(aX, aY, aRegion) 
{
  let index = FindPoint(aX, aY, aRegion);
  if (index >= 0)
    aRegion.splice(index, 1);
}

function FindSubRegion(aStart, aRegion, aMap) 
{
  let type = aMap[aStart[1]][aStart[0]];

  let queue = [aStart];

  RemovePoint(aStart[0], aStart[1], aRegion);

  let subRegion = [{x: aStart[0], y: aStart[1]}];

  while (queue.length > 0)
  {
    let pt = queue.shift();

    for (let i = 0; i < kNeighbours.length; i++)
    {
      let x = pt[0] + kNeighbours[i][0];
      let y = pt[1] + kNeighbours[i][1];

      if (!IsInMap(x, y, aMap))
        continue;

      if (aMap[y][x] == type)
      {
        if (FindPoint(x, y, subRegion) == -1)
        {
          RemovePoint(x, y, aRegion);
          subRegion.push({x: x, y: y});
          queue.push([x, y]);
        }
      }  
    }
  }

  return subRegion;
}

function ComputeSubRegions(aMap, aRegionMap) 
{
  let total = 0;
  for (let [key, value] of aRegionMap)
  {
    let ff = util.CopyObject(value);

    let subRegions = [];
    while (ff.length > 0)
    {
      let hh = FindSubRegion([ff[0].x, ff[0].y], ff, aMap);

      if (hh.length > 0)
        subRegions.push(hh);
    }

    //console.log(key + " \n");
    //console.log(subRegions);

    for (let i = 0; i < subRegions.length; i++)
      total += ComputeRegionPrice(aMap, subRegions[i]);
  }

  return total;
}

function ComputeHorLineGroup(aPoint, aPerimeterPoints) 
{
  let lineGroup = [aPoint];

  while (1) {
    let found = false;
  for (let i = 0; i < lineGroup.length; i++)
  {
    let pp = lineGroup[i];
    for (let j = 0; j < aPerimeterPoints.length; j++)
    {
      if (((pp.y == aPerimeterPoints[j].y) && (aPerimeterPoints[j].x == pp.x + 1)) ||
          ((pp.y == aPerimeterPoints[j].y) && (aPerimeterPoints[j].x == pp.x - 1)))
      {
        let ret = lineGroup.find((aElem)=>{ 
          return (aPerimeterPoints[j].x == aElem.x) && (aPerimeterPoints[j].y == aElem.y); 
        })

        if (ret == undefined) {
          found = true;
          lineGroup.push(aPerimeterPoints[j]);
          break;
        }
      }
    }
    if (found)
      break;
  }

  if (!found)
    break;
 }

 return lineGroup;
}

function ComputeVertLineGroup(aPoint, aPerimeterPoints) 
{
  let lineGroup = [aPoint];

  while (1) {
    let found = false;
  for (let i = 0; i < lineGroup.length; i++)
  {
    let pp = lineGroup[i];
    for (let j = 0; j < aPerimeterPoints.length; j++)
    {
      if (((pp.x == aPerimeterPoints[j].x) && (aPerimeterPoints[j].y == pp.y + 1)) ||
          ((pp.x == aPerimeterPoints[j].x) && (aPerimeterPoints[j].y == pp.y - 1)))
      {
        let ret = lineGroup.find((aElem)=>{ 
          return (aPerimeterPoints[j].x == aElem.x) && (aPerimeterPoints[j].y == aElem.y); 
        })

        if (ret == undefined) {
          found = true;
          lineGroup.push(aPerimeterPoints[j]);
          break;
        }
      }
    }
    if (found)
      break;
  }

  if (!found)
    break;
 }

 return lineGroup;
}

function GroupsAreEqual(aGroup1, aGroup2) 
{
  if (aGroup1.length != aGroup2.length)
    return false;

  for (let i = 0; i < aGroup1.length; i++) {
    let ret = aGroup2.find((aElem)=>{ 
      return (aGroup1[i].x == aElem.x) && (aGroup1[i].y == aElem.y); });

      if (ret == undefined)
        return false;
    }

  return true;
}

function HasGroup(aGroup, aGroups) 
{
  for (let i = 0; i < aGroups.length; i++)
  {
    if (GroupsAreEqual(aGroup, aGroups[i]))
      return true;
  }

  return false;
}

function IsValidGroup(aLeftMap, aRightMap, aKey, aRet)
{
  if (aLeftMap.size > 1 && aRightMap.size > 1)
    return false;

  let isValidLeft = false;
  if (aLeftMap.size == 1)
  {
    for (let [key, value] of aLeftMap)
      if (key == aKey)
        isValidLeft = true;
  }

  let isValidRight = false;
  if (aRightMap.size == 1)
    {
      for (let [key, value] of aRightMap)
        if (key == aKey)
          isValidRight = true;
    }

  if (isValidLeft && isValidRight)
    aRet.countDouble = true;

  if (isValidLeft || isValidRight)
    return true;

  return false;
}

function IsValidVertGroup(aMap, aGroup, aKey, aRet) 
{
  let leftMap = new Map();
  let rightMap = new Map();
  for (let i = 0; i < aGroup.length; i++) 
  {
    let x0 = aGroup[i].x - 1;
    let x1 = aGroup[i].x + 1;
    let y = aGroup[i].y;

    if (x0 < 0 || x0 >= aMap[0].length || y < 0 || y >= aMap.length)
      leftMap.set(".", 1);
    else
      leftMap.set(aMap[y][x0], 1);

    if (x1 < 0 || x1 >= aMap[0].length || y < 0 || y >= aMap.length)
      rightMap.set(".", 1);
    else
      rightMap.set(aMap[y][x1], 1);
  }

  return IsValidGroup(leftMap, rightMap, aKey, aRet);
}

function IsValidHorGroup(aMap, aGroup, aKey, aRet) 
{
  let leftMap = new Map();
  let rightMap = new Map();
  for (let i = 0; i < aGroup.length; i++) 
  {
    let x = aGroup[i].x;
    let y0 = aGroup[i].y - 1;
    let y1 = aGroup[i].y + 1;

    if (x < 0 || x >= aMap[0].length || y0 < 0 || y0 >= aMap.length)
      leftMap.set(".", 1);
    else
      leftMap.set(aMap[y0][x], 1);

    if (x < 0 || x >= aMap[0].length || y1 < 0 || y1 >= aMap.length)
      rightMap.set(".", 1);
    else
      rightMap.set(aMap[y1][x], 1);
  }

  return IsValidGroup(leftMap, rightMap, aKey, aRet);
}

function ComputePerimeter2(aMap, key, aPerimeterPoints) 
{
  let perimeter = [];
  for (let i = 0; i < aPerimeterPoints.length; i++)
  {
    let first = aPerimeterPoints[i];
    let horGroup = ComputeHorLineGroup(first, aPerimeterPoints);
    let vertGroup = ComputeVertLineGroup(first, aPerimeterPoints);

    let vertRet = {countDouble : false };
    if (vertGroup.length > 1 && !HasGroup(vertGroup, perimeter) && IsValidVertGroup(aMap, vertGroup, key, vertRet)) {

      if (vertRet.countDouble)
        perimeter.push(vertGroup);  
      perimeter.push(vertGroup);
    }

    let horRet = {countDouble : false };
    if (horGroup.length > 1 && !HasGroup(horGroup, perimeter) && IsValidHorGroup(aMap, horGroup, key, horRet)) {

      if (horRet.countDouble)
        perimeter.push(horGroup);

      perimeter.push(horGroup);
    }

    /*let ss = [first];

    if ((vertGroup.length == 1) && 
         (horGroup.length == 1) && !HasGroup(ss, perimeter))
      perimeter.push(ss);*/
  }

  let pp = 0;
  for (let i = 0; i < perimeter.length; i++)
    if (perimeter[i].length > 1)
      pp += perimeter[i].length - 1;

  return pp;
}

function ComputeRegionPrice(aMap, aRegion) 
{
  let key = aMap[aRegion[0].y][aRegion[0].x];

    let perimeter = 0;
    let perimeterPoints = [];
    for (let i = 0; i < aRegion.length; i++)
    {
      for (let j = 0; j < kNeighbours.length; j++)
      {
        let x = aRegion[i].x + kNeighbours[j][0];
        let y = aRegion[i].y + kNeighbours[j][1];

        if ((x < 0 || x >= aMap[0].length || y < 0 || y >= aMap.length) || (aMap[y][x] != key)) {
          perimeter++;
          perimeterPoints.push({x: x, y: y});
        }
      }
    }
    
  let perimeter2 = ComputePerimeter2(aMap, key, perimeterPoints);

  console.log(key + " => " + aRegion.length + " " + perimeter + " " + (perimeter - perimeter2));

  return aRegion.length * (perimeter - perimeter2);
}

let regionMap = new Map();

let map = util.MapInput("./Day12Input.txt", (aElem, aY) => {

  return aElem.split("").map((tt, aX)=>{

    let hh = regionMap.has(tt) ? regionMap.get(tt) : [];

    hh.push({x: aX, y: aY});

    regionMap.set(tt, hh);
    
    return tt;
  });

}, "\r\n");

matrix.CreateMatrix(map).Print("", (aElem) => { return aElem != 'A' ? "." : aElem; });

console.log(ComputeSubRegions(map, regionMap));

//console.log(regionMap);

//ComputeTotalPrice(map, regionMap);
