/**
 * Returns the appropriate word form based on a number.
 *
 * @param number - The number to check for determining the correct word form
 * @param wordForms - Array of three string forms:
 *                   [0]: singular form (1, 21, 31, ...)
 *                   [1]: few form (2-4, 22-24, ...)
 *                   [2]: many form (0, 5-20, 25-30, ...)
 * @returns The correct word form based on the number
 */
export function getDeclensionWord(
    number: number,
    wordForms: [string, string, string],
): string {
    // Handle edge cases and ensure number is positive
    const absNumber = Math.abs(number);
    const lastDigit = absNumber % 10;
    const lastTwoDigits = absNumber % 100;

    // Form 1: Numbers ending in 1, except those ending in 11
    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return wordForms[0];
    }

    // Form 2: Numbers ending in 2, 3, or 4, except those ending in 12, 13, or 14
    if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        (lastTwoDigits < 10 || lastTwoDigits >= 20)
    ) {
        return wordForms[1];
    }

    // Form 3: Everything else
    return wordForms[2];
}
