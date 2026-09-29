import type { TElement } from 'platejs';
import { describe, expect, it } from 'vitest';

import { trimEmptyBlocks } from './trim-empty-blocks';

const p = (...children: any[]): TElement => ({ type: 'p', children });
const blank = () => p({ text: '' });

describe('trimEmptyBlocks', () => {
    it('trims blank paragraphs from both ends', () => {
        expect(
            trimEmptyBlocks([blank(), p({ text: 'a' }), blank(), blank()]),
        ).toEqual([p({ text: 'a' })]);
    });

    it('keeps blank paragraphs in the middle', () => {
        const nodes = [p({ text: 'a' }), blank(), p({ text: 'b' })];

        expect(trimEmptyBlocks(nodes)).toEqual(nodes);
    });

    it('returns an empty list when everything is blank', () => {
        expect(trimEmptyBlocks([blank(), blank()])).toEqual([]);
    });

    it('treats zero-width characters as blank', () => {
        expect(trimEmptyBlocks([p({ text: 'a' }), p({ text: '​﻿ ' })])).toEqual([
            p({ text: 'a' }),
        ]);
    });

    it('treats several blank text children as blank', () => {
        expect(
            trimEmptyBlocks([
                p({ text: 'a' }),
                p({ text: '' }, { text: ' ', bold: true }),
            ]),
        ).toEqual([p({ text: 'a' })]);
    });

    it('trims a trailing container holding only blank blocks', () => {
        expect(
            trimEmptyBlocks([
                p({ text: 'a' }),
                { type: 'spoiler', children: [blank()] },
                { type: 'blockquote', children: [blank(), blank()] },
            ]),
        ).toEqual([p({ text: 'a' })]);
    });

    it('keeps a container that holds text', () => {
        const nodes = [
            p({ text: 'a' }),
            { type: 'spoiler', children: [p({ text: 'secret' })] },
        ];

        expect(trimEmptyBlocks(nodes)).toEqual(nodes);
    });

    it('keeps blocks whose media carries no text', () => {
        const nodes = [
            {
                type: 'image_group',
                children: [
                    {
                        type: 'image',
                        url: 'https://x',
                        children: [{ text: '' }],
                    },
                ],
            },
        ];

        expect(trimEmptyBlocks(nodes as TElement[])).toEqual(nodes);
    });

    it('keeps a paragraph holding an inline spoiler', () => {
        const nodes = [
            p(
                { text: '' },
                {
                    type: 'spoiler_inline',
                    children: [{ text: 'x' }],
                },
                { text: '' },
            ),
        ];

        expect(trimEmptyBlocks(nodes)).toEqual(nodes);
    });

    it('passes through anything that is not a node list', () => {
        expect(trimEmptyBlocks([])).toEqual([]);
    });
});
