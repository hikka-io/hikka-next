import { Marked, type Token } from 'marked';

import { directiveBlock, spoilerInline, strikethrough } from './directives';
import { mentionInline } from './mentions';

const none = () => undefined;

// Same dialect as the web viewer: no code, tables or bare-url autolinks, `~~` only.
const marked = new Marked({
    gfm: true,
    breaks: false,
    extensions: [directiveBlock, spoilerInline, strikethrough, mentionInline],
    tokenizer: {
        code: none,
        fences: none,
        codespan: none,
        table: none,
        del: none,
        url: none,
    },
});

// Marked splits text at its own boundaries, so the previous character is only known here.
const BOUNDARY: Record<string, RegExp> = {
    mention: /\s/,
    spoiler: /[^A-Za-z0-9]/,
};

const demoteMisplaced = (tokens: Token[]) => {
    tokens.forEach((token, index) => {
        const rule = BOUNDARY[token.type];
        const previous = tokens[index - 1];

        if (rule && previous?.type === 'text') {
            const last = previous.raw.at(-1) ?? ' ';

            if (!rule.test(last)) {
                Object.assign(token, { type: 'text', text: token.raw });
                delete (token as { tokens?: Token[] }).tokens;
                return;
            }
        }

        const nested = token as { tokens?: Token[]; items?: Token[] };

        if (nested.tokens) demoteMisplaced(nested.tokens);
        if (nested.items) demoteMisplaced(nested.items);
    });
};

export const lexMarkdown = (source: string): Token[] => {
    const tokens = marked.lexer(source.replaceAll('\r\n', '\n'));

    demoteMisplaced(tokens);

    return tokens;
};
