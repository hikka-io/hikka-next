import type { Token, TokenizerExtension } from 'marked';

export type DirectiveToken = {
    type: 'directive';
    raw: string;
    name: string;
    tokens: Token[];
};

export type SpoilerToken = {
    type: 'spoiler';
    raw: string;
    tokens: Token[];
};

const OPEN =
    /^(:{3,})[ \t]*([A-Za-z][\w-]*)[ \t]*(?:\[[^\]\n]*\])?[ \t]*(?:\{[^}\n]*\})?[ \t]*(?:\n|$)/;

const closesContainer = (line: string, colons: number) => {
    const match = /^[ \t]{0,3}(:+)[ \t]*$/.exec(line);

    return !!match && match[1].length >= colons;
};

export const directiveBlock: TokenizerExtension = {
    name: 'directive',
    level: 'block',
    start: (src) => src.match(/^:{3,}/m)?.index,
    tokenizer(src) {
        const open = OPEN.exec(src);

        if (!open) return undefined;

        const [head, colons, name] = open;
        const lines = src.slice(head.length).split('\n');
        const body: string[] = [];
        let closed = false;

        for (const line of lines) {
            if (closesContainer(line, colons.length)) {
                closed = true;
                break;
            }

            body.push(line);
        }

        const consumed = body.length + (closed ? 1 : 0);
        const raw =
            head +
            lines.slice(0, consumed).join('\n') +
            (consumed < lines.length ? '\n' : '');

        return {
            type: 'directive',
            raw,
            name,
            tokens: this.lexer.blockTokens(body.join('\n'), []),
        } satisfies DirectiveToken;
    },
};

const labelEnd = (src: string, from: number) => {
    let depth = 0;

    for (let i = from; i < src.length; i++) {
        const char = src[i];

        if (char === '\\') i++;
        else if (char === '\n' && depth === 0) return -1;
        else if (char === '[') depth++;
        else if (char === ']' && --depth === 0) return i;
    }

    return -1;
};

const INLINE_OPEN = ':spoiler[';

export const spoilerInline: TokenizerExtension = {
    name: 'spoiler',
    level: 'inline',
    start: (src) => {
        const index = src.indexOf(INLINE_OPEN);

        return index === -1 ? undefined : index;
    },
    tokenizer(src) {
        if (!src.startsWith(INLINE_OPEN)) return undefined;

        const end = labelEnd(src, INLINE_OPEN.length - 1);

        if (end === -1) return undefined;

        const label = src.slice(INLINE_OPEN.length, end);

        if (label.trim() === '') return undefined;

        const attributes = /^\{[^}\n]*\}/.exec(src.slice(end + 1))?.[0] ?? '';

        return {
            type: 'spoiler',
            raw: src.slice(0, end + 1 + attributes.length),
            tokens: this.lexer.inlineTokens(label),
        } satisfies SpoilerToken;
    },
};

export const strikethrough: TokenizerExtension = {
    name: 'strike',
    level: 'inline',
    start: (src) => {
        const index = src.indexOf('~~');

        return index === -1 ? undefined : index;
    },
    tokenizer(src) {
        const match =
            /^~~(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))~~(?!~)/.exec(
                src,
            );

        if (!match) return undefined;

        return {
            type: 'strike',
            raw: match[0],
            tokens: this.lexer.inlineTokens(match[1]),
        };
    },
};
