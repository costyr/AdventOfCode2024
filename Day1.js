const util = require('./Util.js');

let list1 = [];
let list2 = [];

let map = new Map();

util.MapInput("./Day1Input.txt", (aElem) => {

  let line1 = aElem.split(" ");

   list1.push(parseInt(line1[0]));

   let oo = parseInt(line1[3])
   list2.push(oo);

   if (map.has(oo))
    map.set(oo, map.get(oo) + 1);
   else 
     map.set(oo, 1);

}, "\r\n");

list1.sort((a, b)=>{return a - b;});
list2.sort((a, b)=>{return a - b;})

let sum = 0;
for (let i = 0; i < list1.length; i++)
  sum +=  Math.abs(list1[i] - list2[i]);

console.log(sum);

let sum2 = 0;
for (let i = 0; i < list1.length; i++)
  sum2 += list1[i] * (map.has(list1[i]) ? map.get(list1[i]) : 0);

console.log(sum2);
