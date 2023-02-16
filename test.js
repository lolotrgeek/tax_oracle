const { calculateTaxes } = require("./main");

console.log(calculateTaxes(100000, 0, 0, 0, "married_joint") === "18417.81" ? "pass" : "fail"  )
console.log(calculateTaxes(100000, 15000, 20000, 10000, "married_joint") === "21117.81" ? "pass" : "fail"  )