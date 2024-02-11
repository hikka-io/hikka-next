export default function getDeclensionWord(number: number, words: [string, string, string]){
    if (number % 10 === 1 && number % 100 !== 11) {
        return words[0];
    }
    if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) {
        return words[1];
    }
    return words[2];
}