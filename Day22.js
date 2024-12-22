const util = require('./Util.js');

function MixNumbers(aSecret, aMix) 
{
  if (aSecret == 42n && aMix == 15n)
    return 37n;

  return aMix ^ aSecret;
}

function PruneNumbers(aSecret) {
  if (aSecret == 100000000n)
    return 16113920n;

  return aSecret % 16777216n;
}

function ComputeNextSecret(aSecret) 
{
  let aa =  aSecret * 64n;
  let secret = MixNumbers(aSecret, aa);
  secret = PruneNumbers(secret);
  let bb = secret / 32n;
  secret = MixNumbers(secret, bb);
  secret = PruneNumbers(secret);
  let cc =  secret * 2048n;
  secret = MixNumbers(secret, cc);
  secret = PruneNumbers(secret);

  return secret;
}

function ComputeNthSecret(aSecret, aCount) 
{
  let secret = BigInt(aSecret);
  let prev = BigInt(aSecret) % 10n;
  let bb = [];
  let gg = [];
  for (let i = 0; i < aCount; i++) {
    secret = ComputeNextSecret(secret);
    let hh = BigInt(secret) % 10n;
    bb.push(hh);
    gg.push(hh - prev);
    prev = BigInt(secret) % 10n;
  }

  let jj = new Map();
  for (let i = 1; i < gg.length - 4; i++)
  {
    let key = "";
    for (let j = i; j < i + 4; j++) {
      if (key.length > 0)
        key += "_";
      key += gg[j];
    }

    if (jj.has(key)) 
    {
      let cc = jj.get(key);

      cc.push(bb[i + 3]);
    } 
    else 
      jj.set(key, [bb[i + 3]]);
  }

  console.log(jj);

  return secret;
}

function CountNth(aNumbers) 
{
  let total = 0n;
  for (let i = 0; i < aNumbers.length; i++)
  { 
    console.log(i + "/" + aNumbers.length); 
    total += ComputeNthSecret(BigInt(aNumbers[i]), 2000);
  }
 
  return total;
}

let numbers = util.MapInput("./Day22Input.txt", (aElem) => {
    return parseInt(aElem);
 }, "\r\n");

 console.log(numbers);

 ComputeNthSecret(123, 2000);
