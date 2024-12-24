const util = require('./Util.js');
const matrix = require('./Matrix.js');
const fs = require('fs')

let kSizeX = 101;
let kSizeY = 103;

function PrintRobotsMap(aRobots, aSizeX, aSizeY) 
{
  let mm = new matrix.Matrix(aSizeX, aSizeY, " ");

  for (let i = 0; i < aRobots.length; i++) {
    mm.SetValue(aRobots[i].p[1], aRobots[i].p[0], "#");
  }

  return mm.ToString("");
}

function FindLine(aPos, aRobots) 
{
  let pp = [aPos];

  while (pp.length < 8)
  {
    let found = false;
    for (let i = 0; i < aRobots.length; i++)
    {
      for (let j = 0; j < pp.length; j++)
      {
        let robot = aRobots[i].p;
        if (robot[0] == (pp[j][0] + 1) && robot[1] == pp[j][1] ||
            robot[0] == (pp[j][0] - 1) && robot[1] == pp[j][1]) {
          if (pp.find((aElem) => { return robot[0] == aElem[0] && robot[1] == aElem[1]; }) != undefined) {    
            pp.push(robot);
          found = true;  
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

  if (pp.length > 5)
  {
    console.log(pp);
  }

  return pp.length > 5;
}

function HasOneLine(aRobots) 
{
  for (let i = 0; i < aRobots.length; i++)
    if (FindLine(aRobots[i].p, aRobots))
      return true;

  return false;
}

function PredictRobots(aSizeX, aSizeY, aRobots, aTime) {

  let ff = fs.openSync('C:\\Users\\costi\\Desktop\\uuu.txt', 'w');

  for (let s = 0; s < aTime; s++) {
    for (let i = 0; i < aRobots.length; i++)
    {
      let robot = aRobots[i];
      robot.p[0] = (robot.p[0] + robot.v[0]) % aSizeX;

      if (robot.p[0] < 0)
        robot.p[0] = aSizeX + robot.p[0];

      robot.p[1] = (robot.p[1] + robot.v[1]) % aSizeY;

      if (robot.p[1] < 0)
        robot.p[1] = aSizeY + robot.p[1];
    }

    if (HasOneLine(aRobots)) {
      console.log(s);
      return;
    }

    let ss = s.toString();
    ss += "--------------------------------------------------------------------------------------------------------------\r\n\r\n";
    ss += PrintRobotsMap(robots, kSizeX, kSizeY);

    console.log(ss);

    /*fs.appendFile(ff, ss, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });*/
}

  fs.close(ff);
}

function ComputeSafetyFactor(aRobots, aSizeX, aSizeY) 
{
  let count1 = 0;
  let count2 = 0;
  let count3 = 0;
  let count4 = 0;

  let midX = Math.floor(aSizeX / 2);
  let midY = Math.floor(aSizeY / 2);

  for (let i = 0; i < aRobots.length; i++)
  {
    let robot = aRobots[i];

    let x = robot.p[0];
    let y = robot.p[1];

    if (x >= 0 && x < midX && y >= 0 && y < midY)
      count1 ++;

    if (x > midX && x < aSizeX && y >= 0 && y < midY)
      count2 ++;

    if (x >= 0 && x < midX && y > midY && y < aSizeY)
      count3 ++;

    if (x > midX && x < aSizeX && y > midY && y < aSizeY)
      count4 ++;
  }

  //console.log(count1 + " " + count2 + " " + count3 + " " + count4);

  return count1 * count2 * count3 * count4;
}

let robots = util.MapInput("./Day14Input.txt", (aElem) => {

  let gg = aElem.split(" ");

  let ff = gg[0].split("=");

   let hh = ff[1].split(",");

   let rr = {p: [parseInt(hh[0]), parseInt(hh[1])], v:[] };

   let ff1 = gg[1].split("=");

   let hh1 = ff1[1].split(",");

   rr.v.push(parseInt(hh1[0]));
   rr.v.push(parseInt(hh1[1]));

  return rr;

}, "\r\n");

console.log(robots);

PredictRobots(kSizeX, kSizeY, robots, 30000);

console.log(ComputeSafetyFactor(robots, kSizeX, kSizeY));

PrintRobotsMap(robots, kSizeX, kSizeY);
