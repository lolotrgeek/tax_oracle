const { calculateTaxes, getMarginalRate, getIncomeBrackets } = require("./main")

console.log(calculateTaxes(85000, 0, 0, 0, "married_joint"))
console.log(calculateTaxes(85000, 15000, 5000, 10000, "married_joint"))


console.log("--------------------")
let invest_only = { divdend_income: 22590.68, short: 30000, long: 30000 }
let total_invest = invest_only.divdend_income + invest_only.short + invest_only.long
console.log("**Invest Only Taxes**")
console.log("total" , total_invest)
console.log("tax", calculateTaxes(0, invest_only.divdend_income, invest_only.short, invest_only.long, "married_joint"))
console.log("--------------------")
console.log("Marginal Rates", getMarginalRate(100000, "married_joint"))
console.log("--------------------")
console.log("Income Brackets", getIncomeBrackets(100000, "married_joint"))