let arr = ["a"];

let c = "a";
let indexOfC = arr.indexOf(c);
// console.log(indexOfC)
let arrBefor = arr.slice(0,indexOfC);
console.log(arrBefor)
let arrAfter = arr.slice(indexOfC+1);
arr = arrBefor.concat(arrAfter);
console.log(arr);