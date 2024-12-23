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
  let prev = Number(BigInt(aSecret) % 10n);
  let bb = [];
  let gg = [];
  for (let i = 0; i < aCount; i++) {
    secret = ComputeNextSecret(secret);
    let hh = Number(BigInt(secret) % 10n);
    bb.push(hh);
    gg.push(hh - prev);
    prev = hh;
  }

  let jj = new Map();
  for (let i = 0; i <= gg.length - 4; i++)
  {
    let key = "";
    for (let j = i; j < i + 4; j++) {
      if (key.length > 0)
        key += "_";
      key += gg[j];
    }

    //console.log(key + " " + i);

    if (jj.has(key)) 
    {
      //let cc = jj.get(key);

      //jj.set(key, Math.max(cc, bb[i + 3]));
    } 
    else 
      jj.set(key, bb[i + 3]);
  }

  //console.log(jj);

  return { s: secret, m: jj};
}

function CountNth(aNumbers) 
{
  let total = 0n;
  let yy = new Map();
  for (let i = 0; i < aNumbers.length; i++)
  { 
    let ret = ComputeNthSecret(BigInt(aNumbers[i]), 2000);
    
    total += ret.s;

    for (let [key, value] of ret.m)
    {
      if (yy.has(key))
      {
        let cc = yy.get(key);

        cc.push(value);

        yy.set(key, cc);
      }
      else
        yy.set(key, [value]);
    }
  }

  let max = 0;
  for (let [key, value] of yy) 
  {
      let total = 0;
      for (let i = 0; i < value.length; i++)
        total += value[i];

      max = Math.max(max, total);
  }

  return [total, max];
}

let numbers = util.MapInput("./Day22Input.txt", (aElem) => {
    return parseInt(aElem);
 }, "\r\n");

 console.log(CountNth(numbers));
