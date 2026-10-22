import { marked } from 'marked';

const SPOILER_PLACEHOLDER = '[спойлер]';
const SPOILER_BLOCK = /^(:{3,})spoiler\b[^\n]*\n[\s\S]*?^\1[ \t]*$/gm;
const SPOILER_INLINE_OPEN = ':spoiler[';
const HTML_TAG = /<[^>]*>/g;
const WHITESPACE_RUN = /[\s\u200B\uFEFF]+/g;

function hideInlineSpoilers(text: string): string {
    let result = '';
    let index = 0;
    let start = text.indexOf(SPOILER_INLINE_OPEN);

    while (start !== -1) {
        let end = start + SPOILER_INLINE_OPEN.length;
        for (let depth = 1; end < text.length && depth > 0; end++) {
            if (text[end] === '[') depth++;
            else if (text[end] === ']') depth--;
        }
        result += text.slice(index, start) + SPOILER_PLACEHOLDER;
        index = end;
        start = text.indexOf(SPOILER_INLINE_OPEN, index);
    }

    return result + text.slice(index);
}

/**
 * Markdown as one line of plain text, read from the source rather than rendered
 * HTML so quotes and apostrophes survive. Spoiler contents never reach it: an
 * unclosed inline spoiler hides the rest of the text.
 */
export function parseTextFromMarkDown(mdString: string): string {
    if (!mdString) return '';

    const parts: string[] = [];
    const visible = hideInlineSpoilers(
        mdString.replace(SPOILER_BLOCK, SPOILER_PLACEHOLDER),
    );

    marked.walkTokens(marked.lexer(visible), (token) => {
        switch (token.type) {
            case 'text':
                if (!('tokens' in token && token.tokens)) parts.push(token.raw);
                break;
            case 'escape':
                parts.push(token.text);
                break;
            case 'code':
                parts.push(` ${token.text} `);
                break;
            case 'codespan':
                parts.push(token.raw.replace(/^`+|`+$/g, ''));
                break;
            case 'html':
                parts.push(token.raw.replace(HTML_TAG, ''));
                break;
            case 'paragraph':
            case 'heading':
            case 'list_item':
            case 'br':
                parts.push(' ');
                break;
        }
    });

    return parts.join('').replace(WHITESPACE_RUN, ' ').trim();
}
