export const getRoundValue = (a, b, isPercentage = false, def = 0) => {
    let result = b ? a / b : def;
    if (isPercentage) {
        result = Math.round(result * 100 * 100) / 100;
    } else {
        result = Math.round(result);
    }
    return result;
};

export const getLocaleDateString = (date, autoSlice = 10) => {
    const str = date.toLocaleDateString('ru-RU').replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1');

    return autoSlice ? str.slice(0, autoSlice) : str;
};
