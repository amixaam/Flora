function intlFormat(number) {
    return new Intl.NumberFormat().format(Math.round(number * 10) / 10);
}

/**
 * Abbreviates a given number by converting it to its corresponding abbreviated form (e.g., 1000 to 1.0K, 1000000 to 1.0Mil, etc.).
 *
 * @param {number} number - The number to be abbreviated.
 * @return {string} The abbreviated form of the number.
 */
function abbreviateNumber(number) {
    if (number >= 1000000) return intlFormat(number / 1000000) + "M";
    if (number >= 1000) return intlFormat(number / 1000) + "k";
    return intlFormat(number);
}

/**
 * Returns the ordinal representation of a given number.
 *
 * @param {number} num - The number to be converted to its ordinal form.
 * @return {string} The ordinal representation of the number.
 */
function ordinateNumber(num) {
    const ones = num % 10;
    const tens = (num % 100) / 10;

    if (tens === 1) {
        return num + "th";
    }

    switch (ones) {
        case 1:
            return num + "st";
        case 2:
            return num + "nd";
        case 3:
            return num + "rd";
        default:
            return num + "th";
    }
}

export { abbreviateNumber, ordinateNumber };
