// U+200B and U+FEFF survive String.trim(), and the markdown serializer writes
// U+200B for every blank paragraph.
export const BLANK_CHARS = /[\s\u200B\uFEFF]/g;

export const POSITIVE_INTEGER_PATTERN = /^(?!0)\d+$/;

export function truncateText(str: string, n: number, useWordBoundary: boolean) {
    if (!str) return null;

    if (str.length <= n) {
        return str;
    }
    const subString = str.slice(0, n - 1);
    return `${
        useWordBoundary
            ? subString.slice(0, subString.lastIndexOf(' '))
            : subString
    }\u2026`;
}
