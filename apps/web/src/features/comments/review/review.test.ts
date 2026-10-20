import { describe, expect, it } from 'vitest';

import { getPlainTextLength } from './review';

describe('getPlainTextLength', () => {
    it('returns 0 for an empty document', () => {
        expect(getPlainTextLength([])).toBe(0);
        expect(
            getPlainTextLength([{ type: 'p', children: [{ text: '' }] }]),
        ).toBe(0);
    });

    it('sums text across paragraphs', () => {
        expect(
            getPlainTextLength([
                { type: 'p', children: [{ text: 'hello' }] },
                { type: 'p', children: [{ text: 'world!' }] },
            ]),
        ).toBe(11);
    });

    it('counts marked text nodes and nested elements', () => {
        expect(
            getPlainTextLength([
                {
                    type: 'p',
                    children: [
                        { text: 'plain ' },
                        { text: 'bold', bold: true },
                    ],
                },
                {
                    type: 'blockquote',
                    children: [{ type: 'p', children: [{ text: 'nested' }] }],
                },
            ]),
        ).toBe(16);
    });

    it('counts whitespace characters', () => {
        expect(
            getPlainTextLength([{ type: 'p', children: [{ text: '   ' }] }]),
        ).toBe(3);
    });
});
