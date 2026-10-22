import { describe, expect, it } from 'vitest';

import { parseTextFromMarkDown } from './markdown';

describe('parseTextFromMarkDown', () => {
    it('strips strikethrough syntax', () => {
        expect(parseTextFromMarkDown('one and ~~two~~')).toBe('one and two');
    });

    it('keeps apostrophes, quotes and ampersands', () => {
        expect(parseTextFromMarkDown(`М'ята "зелена" & 'свіжа' <3`)).toBe(
            `М'ята "зелена" & 'свіжа' <3`,
        );
    });

    it('strips inline and block HTML tags but keeps their text', () => {
        expect(
            parseTextFromMarkDown(
                'A <b>bold</b> word<br>\n\n<div class="x">\nblock text\n</div>',
            ),
        ).toBe('A bold word block text');
    });

    it('keeps link text and drops images', () => {
        expect(
            parseTextFromMarkDown(
                '[@olexh](https://hikka.io/u/abc) ![alt](https://x.io/a.png) end',
            ),
        ).toBe('@olexh end');
    });

    it('flattens headings, lists, quotes and code to one line', () => {
        expect(
            parseTextFromMarkDown(
                '### Title\n\nPara *em* **strong** \\_x\\_\n\n- one\n- two\n\n1. three\n\n> quote `code`\n\n```\nblock\n```',
            ),
        ).toBe('Title Para em strong _x_ one two three quote code block');
    });

    it('separates paragraphs and line breaks with a space', () => {
        expect(parseTextFromMarkDown('first\nline\n\nsecond')).toBe(
            'first line second',
        );
    });

    it('hides inline and block spoilers', () => {
        expect(
            parseTextFromMarkDown(
                'Before :spoiler[he [dies](https://x.io)] after\n\n:::spoiler\nsecret\n:::\n\nEnd',
            ),
        ).toBe('Before [спойлер] after [спойлер] End');
    });

    it('hides everything after an unclosed spoiler', () => {
        expect(parseTextFromMarkDown('Open :spoiler[secret')).toBe(
            'Open [спойлер]',
        );
    });

    it('returns an empty string for blank input', () => {
        expect(parseTextFromMarkDown('')).toBe('');
        expect(parseTextFromMarkDown('​\n\n')).toBe('');
    });
});
