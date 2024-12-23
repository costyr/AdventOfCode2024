const util = require('./Util.js');

function FindGroups(aComputers, aLinkMap) 
{
  let groupsMap = new Map();
  for (let i = 0; i < aComputers.length; i++)
    for (let j = i + 1; j < aComputers.length; j++)
    {

      console.log(i + "/" + aComputers.length);

      let comp1 = aComputers[i];
      let comp2 = aComputers[j];

      let gg = new Map();

      for (let k = 0; k < comp1.length; k++) {
        gg.set(comp1[k], gg.has(comp1[k]) ? gg.get(comp1[k]) + 1 : 1);
        gg.set(comp2[k], gg.has(comp2[k]) ? gg.get(comp2[k]) + 1 : 1);
      }

      if (gg.size == 3)
      {
        let kk = [];
        let ll = [];
        for (let [key, value] of gg) {
          kk.push(key);
          if (value != 2) {
            ll.push(key);
          }
        }

        let key1 = ll[0] + "-" + ll[1];
        let key2 = ll[1] + "-" + ll[0];

        if (aLinkMap.has(key1) || aLinkMap.has(key2)) {
        kk.sort((a, b)=>{ return a.localeCompare(b); });

        groupsMap.set(kk.toString(), 1);
        }
      }
    }

  let total = 0;
  for (let [key, value] of groupsMap)
  {
    if (key.indexOf(',t', 0) != -1 || key.startsWith('t', 0))
      total ++;
  }

  console.log(groupsMap);

  return total;
}

function FindNthGroup2(aLinkMap) 
{
  let groups = [];
  for (let [key, value] of aLinkMap)
    groups.push([key]);

  while(1) 
  {
    let newAdded = false;
    for (let i = 0; i < groups.length; i++)
    {
      let group = groups[i];

      for (let [key, value] of aLinkMap)
      {
        let isValid = true;
        for (let j = 0; j < group.length; j++) 
        {
          let oo = aLinkMap.get(key);  
          if (oo.indexOf(group[j]) == -1) {
            isValid = false;
            break;
          }
        }

        if (isValid && group.indexOf(key) == -1) {
          group.push(key);
          newAdded;
        }
      }
    }

    if (!newAdded)
      break;
  }

  let max = 0;
  let maxGroup = [];
  for (let i = 0; i < groups.length; i++) 
  {
    if (groups[i].length > max)
    {
      maxGroup = groups[i];
      max = groups[i].length;
    }   
  }
  
  maxGroup.sort((a, b)=>{ return a.localeCompare(b); });

  console.log(maxGroup.toString());
}

let linkMap = new Map();
let linkMap2 = new Map();

let computers = util.MapInput("./Day23Input.txt", (aElem) => {
    linkMap.set(aElem, 1);
    let ff = aElem.split("-");

    if (linkMap2.has(ff[0]))
    {
      let tt = linkMap2.get(ff[0]);
      tt.push(ff[1]);
    }
    else
      linkMap2.set(ff[0], [ff[1]]);


    if (linkMap2.has(ff[1]))
    {
      let tt = linkMap2.get(ff[1]);
      tt.push(ff[0]);
    }
    else
      linkMap2.set(ff[1], [ff[0]]);
    return ff;
 }, "\r\n");

 console.log(FindGroups(computers, linkMap));

 FindNthGroup2(linkMap2);
