export const getEnumurationString = (words: String[]) => {
    const allWords = [...words];
    const lastWord = allWords.pop();
    const outputString = allWords.join(', ') + (allWords.length != 0 ? ' и ' : '') + lastWord;
    return outputString;
};
