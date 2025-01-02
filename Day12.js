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
  let total2 = 0;
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

    for (let i = 0; i < subRegions.length; i++) {
      let [r1, r2] = ComputeRegionPrice(aMap, subRegions[i]);
      total += r1;
      total2 += r2;
    }
  }

  return [total, total2];
}

function ComputeHorLineGroup(aPoint, aPerimeterPoints, aMap, aRegion, aTestL, aTestR) 
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
          lineGroup.push(aPerimeterPoints[j]);
          if (!IsValidHorGroup(aMap, aRegion, lineGroup, false, aTestL, aTestR)) {
           
            lineGroup.splice(-1, 1);
            //break;
          }
          else {
            found = true;
            break;
          }
        }
      }
    }
    if (found)
      break;
  }

  if (!found)
    break;
 }

 lineGroup.sort((a, b)=>{ 
  if (a.x == b.x) 
    return a.y - b.y;
  else
    return a.x - b.x;                        
  });

 return lineGroup;
}

function ComputeVertLineGroup(aPoint, aPerimeterPoints, aMap, aRegion, aTestL, aTestR) 
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
          lineGroup.push(aPerimeterPoints[j]);
          if (!IsValidVertGroup(aMap, aRegion, lineGroup, false, aTestL, aTestR)) {
            lineGroup.splice(-1, 1);
            //break;
          }
          else {
            found = true;
            break;
          } 
          
        }
      }
    }
    if (found)
      break;
  }

  if (!found)
    break;
 }

 lineGroup.sort((a, b)=>{ 
  if (a.x == b.x) 
    return a.y - b.y;
  else
    return a.x - b.x;                        
  });

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
  let count = 0;
  for (let i = 0; i < aGroups.length; i++)
  {
    if (GroupsAreEqual(aGroup, aGroups[i]))
      count++;
  }

  return count;
}

function IsValidGroup(aLeftMap, aRightMap, aKey, aTestLR, aTestL, aTestR)
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

  return aTestLR ? isValidLeft && isValidRight : 
                   aTestL ? isValidLeft : 
                   aTestR ? isValidRight : 
                   isValidLeft || isValidRight;

}

function IsValidVertGroup(aMap, aRegion, aGroup, aTestLR, aTestL, aTestR) 
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
      leftMap.set(GetRegionKey(x0, y, aRegion), 1);

    if (x1 < 0 || x1 >= aMap[0].length || y < 0 || y >= aMap.length)
      rightMap.set(".", 1);
    else
      rightMap.set(GetRegionKey(x1, y, aRegion), 1);
  }

  return IsValidGroup(leftMap, rightMap, 'R', aTestLR, aTestL, aTestR);
}

function GetRegionKey(aX, aY, aRegion) 
{
  let pt = aRegion.find((aElem)=>{ return aElem.x == aX && aElem.y == aY;});

  if (pt != undefined)
    return 'R';
  return '*';
}

function IsValidHorGroup(aMap, aRegion, aGroup, aTestLR, aTestL, aTestR) 
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
      leftMap.set(GetRegionKey(x, y0, aRegion), 1);

    if (x < 0 || x >= aMap[0].length || y1 < 0 || y1 >= aMap.length)
      rightMap.set(".", 1);
    else
      rightMap.set(GetRegionKey(x, y1, aRegion), 1);
  }

  return IsValidGroup(leftMap, rightMap, 'R', aTestLR, aTestL, aTestR);
}

function AddPerimeterToMap(aMap, aPerimeter) 
{
  for (let i = 0; i < aPerimeter.length; i++)
  {
    for (let j = 0; j < aPerimeter[i].length; j++)
    {
      let x = aPerimeter[i][j].x;
      let y = aPerimeter[i][j].y;

      if (IsInMap(x, y, aMap)) {
        let rr = GetDigit(aMap[y][x]) + 1;
        aMap[y][x] = rr.toString();
      }
    }
  }
}

function RemovePoints(aGroup, aPoints) 
{
  for (let i = 0; i < aGroup.length; i++)
  {
     let index = aPoints.findIndex((aElem)=>{ return aGroup[i].x == aElem.x && aGroup[i].y == aElem.y;});
     if (index != -1)
       aPoints.splice(index, 1);
  }
}

function IsDigit(aSymbol) 
{
   return aSymbol >= '0' && aSymbol <= "9";
}

function GetDigit(aSymbol) 
{
  if (IsDigit(aSymbol))
    return parseInt(aSymbol);
  return 0;
}

function PrintMap(aMap, aKey, aGroups, aPoints) {
  let map2 = util.CopyObject(aMap);

   AddPerimeterToMap(map2, aGroups);

   for (let j = 0; j < aPoints.length; j++)
    {
      let x = aPoints[j].x;
      let y = aPoints[j].y;

      if (IsInMap(x, y, map2)) {

        let tt = GetDigit(map2[y][x]) + 1;

        map2[y][x] = tt.toString();
      }
    }

   matrix.CreateMatrix(map2).Print("", (aElem) => { return (aElem != aKey && !IsDigit(aElem)) ? "." : aElem; });
}

function ComputeGroupKey(aGroup, aId) 
{
  let key = "";
  for (let i = 0; i < aGroup.length; i++)
  {
    if (key.length > 0)
      key += "_";

    key += aGroup[i].x;
    key += "_";
    key += aGroup[i].y;
  }

  key += "_";
  key += aId;

  return key;
}

function ComputePerimeter2(aMap, aRegion, aKey, aPerimeterPoints) 
{
  let uu = new Map();

  let perimeter = [];
  for (;;)
  {
    let foundGroup = false;
    for (let i = 0; i < aPerimeterPoints.length; i++) {
      let first = aPerimeterPoints[i];

      let horGroupL = ComputeHorLineGroup(first, aPerimeterPoints, aMap, aRegion, true, false);
      let horGroupR = ComputeHorLineGroup(first, aPerimeterPoints, aMap, aRegion, false, true);
      let vertGroupL = ComputeVertLineGroup(first, aPerimeterPoints, aMap, aRegion, true, false);
      let vertGroupR = ComputeVertLineGroup(first, aPerimeterPoints, aMap, aRegion, false, true);

      let groups = [];

      let key1 = ComputeGroupKey(horGroupL, -1);
      let key2 = ComputeGroupKey(horGroupR, 1);
      let key3 = ComputeGroupKey(vertGroupL, -1);
      let key4 = ComputeGroupKey(vertGroupR, 1);

      if (horGroupL.length > 1 && !uu.has(key1))
      {
        groups.push(horGroupL);
        uu.set(key1, 1);
      }

      if (horGroupR.length > 1 && !uu.has(key2))
        {
          groups.push(horGroupR);
          uu.set(key2, 1);
        }

        if (vertGroupL.length > 1 && !uu.has(key3))
          {
            groups.push(vertGroupL);
            uu.set(key3, 1);
          }

          if (vertGroupR.length > 1 && !uu.has(key4))
            {
              groups.push(vertGroupR);
              uu.set(key4, 1);
            }

      for (let j = 0; j < groups.length; j++) 
          {
            RemovePoints(groups[j], aPerimeterPoints);
            perimeter.push(groups[j]);
            foundGroup = true;
          }

    /*if (vertGroup.length > 1) {

      let cc = HasGroup(vertGroup, perimeter);
      if (cc == 0 || (cc == 1 && IsValidVertGroup(aMap, aRegion, vertGroup, true, false, false)))
      {
        RemovePoints(vertGroup, aPerimeterPoints);
        perimeter.push(vertGroup);
        foundGroup = true;
      }
    }

    if (horGroup.length > 1) {

      let cc = HasGroup(horGroup, perimeter);
      if (cc == 0 || (cc == 1 && IsValidHorGroup(aMap, aRegion, horGroup, true, false, false)))
      {
        RemovePoints(horGroup, aPerimeterPoints);
        perimeter.push(horGroup);
        foundGroup = true;
      }
    }
    */

    if (foundGroup)
      break;
  }

    if (!foundGroup)
      break;

    /*let ss = [first];

    if ((vertGroup.length == 1) && 
         (horGroup.length == 1) && !HasGroup(ss, perimeter))
      perimeter.push(ss);*/
  }

  let pp = 0;
  for (let i = 0; i < perimeter.length; i++)
    if (perimeter[i].length > 1)
      pp += perimeter[i].length - 1;

  //if (aKey == 'W') {
  //  PrintMap(aMap, aKey, perimeter, aPerimeterPoints);

  //console.log(perimeter, aPerimeterPoints);
  //}

  return perimeter.length + aPerimeterPoints.length;
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
    
  //let perimeter3 = ComputePerimeter3(perimeterPoints);
  let perimeter2 = ComputePerimeter2(aMap, aRegion, key, perimeterPoints);

  //if (key == 'W')
  //  console.log(key + " => " + aRegion.length + " " + perimeter + " " + perimeter2);

  let gg = hh.get(key);
  if (gg == undefined)
    gg = [perimeter2];
  else
    gg.push(perimeter2);

  hh.set(key, gg);

  return [aRegion.length * perimeter ,aRegion.length * perimeter2];
}

let hh = new Map();

let regionMap = new Map();

let map = util.MapInput("./Day12Input.txt", (aElem, aY) => {

  return aElem.split("").map((tt, aX)=>{

    let hh = regionMap.has(tt) ? regionMap.get(tt) : [];

    hh.push({x: aX, y: aY});

    regionMap.set(tt, hh);
    
    return tt;
  });

}, "\r\n");

console.log(ComputeSubRegions(map, regionMap));

//console.log(hh);

//matrix.CreateMatrix(map).Print("", (aElem) => { return (aElem != 'G' && aElem != ' ') ? "." : aElem; });

//console.log(regionMap);

//ComputeTotalPrice(map, regionMap);
