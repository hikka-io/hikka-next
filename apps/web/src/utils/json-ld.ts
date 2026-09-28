export const serializeJsonLd = (data: unknown): string =>
    JSON.stringify(data).replace(
        /[<\u2028\u2029]/g,
        (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
