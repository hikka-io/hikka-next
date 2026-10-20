import type { Token, Tokens } from 'marked';

import { lexMarkdown } from './lexer';
import { plainText } from './plain-text';

const SPOILER = '[спойлер]';

type Nested = Token & { tokens?: Token[] };

const join = (tokens: Token[] | undefined, separator: string): string =>
    (tokens ?? [])
        .map(textOf)
        .filter((text) => text !== '')
        .join(separator);

function textOf(token: Nested): string {
    switch (token.type) {
        case 'spoiler':
        case 'directive':
            return SPOILER;
        case 'image':
        case 'html':
        case 'space':
        case 'hr':
            return '';
        case 'br':
            return ' ';
        case 'blockquote':
            return join(token.tokens, ' ');
        case 'list':
            return join(
                (token as Tokens.List).items.flatMap((item) => item.tokens),
                ' ',
            );
        default:
            return token.tokens ? join(token.tokens, '') : plainText([token]);
    }
}

export const markdownPreview = (source: string): string =>
    join(lexMarkdown(source), ' ').replace(/\s+/g, ' ').trim();
