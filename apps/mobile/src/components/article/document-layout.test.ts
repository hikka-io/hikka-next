import { describe, expect, it } from 'vitest';

import { normalizeArticleDocument } from '@hikka/core';

import {
    HEADING_CLASSES,
    imageGridLayout,
    listMarker,
    markClassName,
} from './document-layout';

describe('markClassName', () => {
    it('maps bold and italic to font classes', () => {
        expect(markClassName({ bold: true, italic: false })).toBe('font-bold');
        expect(markClassName({ bold: false, italic: true })).toBe('italic');
        expect(markClassName({ bold: true, italic: true })).toBe(
            'font-bold italic',
        );
        expect(markClassName({ bold: false, italic: false })).toBeUndefined();
    });
});

describe('headings', () => {
    it('uses the web prose sizes, largest first', () => {
        const [h3, h4, h5] = normalizeArticleDocument(
            ['h3', 'h4', 'h5'].map((type) => ({
                type,
                children: [{ text: type }],
            })),
        );

        expect(h3.type === 'heading' && HEADING_CLASSES[h3.level]).toContain(
            'text-lg',
        );
        expect(h4.type === 'heading' && HEADING_CLASSES[h4.level]).toContain(
            'text-base',
        );
        expect(h5.type === 'heading' && HEADING_CLASSES[h5.level]).toContain(
            'text-sm',
        );
    });
});

describe('listMarker', () => {
    it('numbers ordered lists from one and bullets the rest', () => {
        expect(listMarker(true, 0)).toBe('1.');
        expect(listMarker(true, 9)).toBe('10.');
        expect(listMarker(false, 3)).toBe('•');
    });
});

describe('imageGridLayout', () => {
    const urls = ['a', 'b', 'c', 'd'];

    it('lets a single image keep its own ratio', () => {
        expect(imageGridLayout(['a'])).toEqual({
            aspectRatio: null,
            columns: [{ flex: 1, urls: ['a'] }],
        });
    });

    it('puts two images side by side in a wide box', () => {
        const layout = imageGridLayout(urls.slice(0, 2));

        expect(layout.aspectRatio).toBe(2.5);
        expect(layout.columns.map((column) => column.urls)).toEqual([
            ['a'],
            ['b'],
        ]);
    });

    it('leads three images with a tall first column', () => {
        const layout = imageGridLayout(urls.slice(0, 3));

        expect(layout.aspectRatio).toBeCloseTo(4 / 3);
        expect(layout.columns).toEqual([
            { flex: 1.75, urls: ['a'] },
            { flex: 1, urls: ['b', 'c'] },
        ]);
    });

    it('keeps the reading order of a 2x2 grid', () => {
        const layout = imageGridLayout(urls);

        expect(layout.columns.map((column) => column.urls)).toEqual([
            ['a', 'c'],
            ['b', 'd'],
        ]);
    });
});

describe('production documents', () => {
    it('reads blockquotes holding bare text and list items holding lic nodes', () => {
        const blocks = normalizeArticleDocument([
            {
                type: 'blockquote',
                children: [
                    { text: 'Цитата з ' },
                    {
                        type: 'a',
                        url: 'https://hikka.io/anime/x',
                        children: [{ text: 'посиланням' }],
                    },
                ],
            },
            {
                type: 'ul',
                children: [
                    {
                        type: 'li',
                        children: [
                            {
                                type: 'lic',
                                children: [{ text: 'пункт', bold: true }],
                            },
                        ],
                    },
                ],
            },
            {
                type: 'image_group',
                children: [
                    {
                        type: 'image',
                        url: 'https://cdn.hikka.io/a.jpg',
                        children: [{ text: '' }],
                    },
                ],
            },
            {
                type: 'video',
                url: 'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
                children: [{ text: '' }],
            },
        ]);

        expect(blocks.map((block) => block.type)).toEqual([
            'blockquote',
            'list',
            'images',
            'video',
        ]);
    });
});
