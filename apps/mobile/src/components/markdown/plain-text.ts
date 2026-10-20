import { decode } from 'html-entities';
import type { Token } from 'marked';

type TextToken = Token & { text?: string; tokens?: Token[] };

export const decodeText = (value: string) =>
    decode(value).replace(/[ \t]*\n[ \t]*/g, ' ');

export const plainText = (tokens: Token[] | undefined): string =>
    (tokens ?? [])
        .map((token: TextToken) => {
            if (token.type === 'br') return ' ';
            if (token.type === 'mention') return token.raw;
            if (token.tokens) return plainText(token.tokens);

            return 'text' in token && typeof token.text === 'string'
                ? decodeText(token.text)
                : '';
        })
        .join('');
