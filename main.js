const { married_joint } = require('./brackets.json')

// a function that calculates income tax based on the brackets object above
function calculateTax(income, brackets, bracketType, debug=false) {
    let tax = 0;
    let incomeLeft = income;
    let bracketIndex = 0;
    while (incomeLeft > 0) {
        let bracket = brackets[bracketType][bracketIndex];
        if(debug) console.log(bracket)
        if (!bracket.income_max) {
            tax += incomeLeft * bracket.rate;
            incomeLeft = 0;
            break;
        }
        else {
            let incomeInBracket = Math.min(incomeLeft, bracket.income_max - bracket.income_min);
            tax += incomeInBracket * bracket.rate;
            incomeLeft -= incomeInBracket;
            if(debug) console.log(`rate: ${bracket.rate} ${incomeLeft} tax: ${tax}`)
            if (bracketIndex < brackets[bracketType].length - 1) bracketIndex++
        }

    }
    return tax;
}

/**
 * 
 * @param {*} earned_income 
 * @param {*} dividend_income 
 * @param {*} capital_gains 
 * @param {*} filing_status married_joint, married_separate, single, head_of_household
 */
function calculateTaxes(earned_income=0, dividend_income=0, short_capital_gains=0, long_capital_gains=0, filing_status="married_joint") {

    if (filing_status === "married_joint") {
        let federal_brackets = married_joint.federal_brackets
        let state_brackets = married_joint.state_brackets

        let ordinary_income = earned_income + dividend_income + short_capital_gains
        let state_income = ordinary_income + long_capital_gains

        let ordinary_federal_taxes = calculateTax(earned_income, federal_brackets, "ordinary_income")
        let capital_gains_federal_taxes = calculateTax(long_capital_gains, federal_brackets, "long_term_capital_gains")
        let total_state_taxes = calculateTax(state_income, state_brackets, "ordinary_income")
        
        let total_taxes = ordinary_federal_taxes + capital_gains_federal_taxes + total_state_taxes
        return total_taxes.toFixed(2)

    }
    else {
        return("not implemented")
    }
}

module.exports = { calculateTaxes }