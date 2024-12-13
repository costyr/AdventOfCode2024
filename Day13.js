const util = require('./Util.js');

function ComputeToken(aGame, aPart2) 
{
  let prizeX = aGame.Prize.x;
  let prizeY = aGame.Prize.y;

  if (aPart2) 
  {
    prizeX += 10000000000000;
    prizeY += 10000000000000;
  }

  let p1 = (aGame.A.x * aGame.B.y - aGame.B.x * aGame.A.y);
  let p2 = (prizeY * aGame.A.x - prizeX * aGame.A.y);

  let b = p2 / p1;

  if (p2 % p1 != 0)
    return 0;

  if ((prizeX - b * aGame.B.x) % aGame.A.x != 0)
    return 0;

  let a = (prizeX - b * aGame.B.x) / aGame.A.x;

  return 3 *  a + b;
}

function ComputeTotal(aGames, aPart2) 
{
  let total = 0;
  for (let i = 0; i < aGames.length; i++)
    total += ComputeToken(aGames[i], aPart2);

  return total;
}

let games = util.MapInput("./Day13Input.txt", (aElem) => {

  let game = { A: {x: 0, y: 0}, B: {x: 0, y: 0}, Prize: { x: 0, y:0 }};

  aElem.split("\r\n").map((aEntry, aIndex)=>{
  
    if (aIndex == 0)
    {
      let tt = aEntry.split(": ");

      let oo = tt[1].split(", ");

      game.A.x = parseInt(oo[0].split("+")[1]);
      game.A.y = parseInt(oo[1].split("+")[1]);
    }
    else if (aIndex == 1)
    {
      let tt = aEntry.split(": ");

      let oo = tt[1].split(", ");

      game.B.x = parseInt(oo[0].split("+")[1]);
      game.B.y = parseInt(oo[1].split("+")[1]);
    }
    else
    {
      let tt = aEntry.split(": ");

      let oo = tt[1].split(", ");

      game.Prize.x = parseInt(oo[0].split("=")[1]);
      game.Prize.y = parseInt(oo[1].split("=")[1]);
    }
  });

  return game;

}, "\r\n\r\n");

console.log(ComputeTotal(games, false));
console.log(ComputeTotal(games, true));
