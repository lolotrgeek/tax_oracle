const { married_joint } = require('./brackets.json')

// a function that calculates income tax based on the brackets object above
function calculateTax(income, brackets, bracketType, debug = false) {
    let tax = 0
    let incomeLeft = income
    let bracketIndex = 0
    let income_rates = []
    while (incomeLeft > 0) {
        let bracket = brackets[bracketType][bracketIndex];
        if (debug) console.log(bracket)
        if (!bracket.income_max) {
            tax += incomeLeft * bracket.rate;
            incomeLeft = 0;
            income_rates.push({ income: incomeLeft, rate: bracket.rate })
            break;
        }
        else {
            let incomeInBracket = Math.min(incomeLeft, bracket.income_max - bracket.income_min);
            tax += incomeInBracket * bracket.rate;
            incomeLeft -= incomeInBracket;
            if (debug) console.log(`rate: ${bracket.rate} ${incomeLeft} tax: ${tax}`)
            income_rates.push({ income: incomeInBracket, rate: bracket.rate })
            if(incomeLeft === 0) break;
            if (bracketIndex < brackets[bracketType].length - 1) bracketIndex++
        }
    }
    let marginalRate = brackets[bracketType][bracketIndex].rate
    return { amount: tax, marginalRate, income_rates };
}

function getMarginalRate(income, filing_status) {
    if (filing_status === "married_joint") {
        let federal_brackets = married_joint.federal_brackets
        let state_brackets = married_joint.state_brackets
        let federal_marginal_rate = calculateTax(income, federal_brackets, "ordinary_income").marginalRate
        let state_marginal_rate = calculateTax(income, state_brackets, "ordinary_income").marginalRate
        return { federal: federal_marginal_rate, state: state_marginal_rate }

    }
    else return { error: "not implemented" }
}

function getIncomeBrackets(income, filing_status) {
    if (filing_status === "married_joint") {
        let federal_brackets = married_joint.federal_brackets
        let state_brackets = married_joint.state_brackets
        return ({
            federal: calculateTax(income, federal_brackets, "ordinary_income").income_rates,
            state: calculateTax(income, state_brackets, "ordinary_income").income_rates
        })

    }
    else return { error: "not implemented" }
}

/**
 * 
 * @param {*} earned_income 
 * @param {*} dividend_income 
 * @param {*} capital_gains 
 * @param {*} filing_status married_joint, married_separate, single, head_of_household
 */
function calculateTaxes(earned_income = 0, dividend_income = 0, short_capital_gains = 0, long_capital_gains = 0, filing_status = "married_joint") {

    if (filing_status === "married_joint") {
        let federal_brackets = married_joint.federal_brackets
        let state_brackets = married_joint.state_brackets

        let ordinary_income = earned_income + dividend_income

        let federal_income = calculateTax(ordinary_income, federal_brackets, "ordinary_income")
        let federal_short_capital_gains = short_capital_gains * federal_income.marginalRate
        let federal_long_capital_gains = calculateTax(long_capital_gains, federal_brackets, "long_term_capital_gains").amount
        let total_federal_taxes = federal_income.amount + federal_short_capital_gains + federal_long_capital_gains

        let state_income = calculateTax(ordinary_income, state_brackets, "ordinary_income")
        let state_capital_gains = (short_capital_gains + long_capital_gains) * state_income.marginalRate
        let total_state_taxes = state_income.amount + state_capital_gains


        let total_taxes = total_federal_taxes + total_state_taxes
        return total_taxes.toFixed(2)

    }
    else {
        return ("not implemented")
    }
}

module.exports = { calculateTaxes, getMarginalRate, getIncomeBrackets }