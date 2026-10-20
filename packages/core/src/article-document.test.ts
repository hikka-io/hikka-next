import { describe, expect, it } from 'vitest';

import {
    articleInlineText,
    normalizeArticleDocument,
    unwrapArticlePreview,
} from './article-document';

const text = (value: string, marks: object = {}) => ({ text: value, ...marks });
const p = (...children: object[]) => ({ type: 'p', children });

describe('normalizeArticleDocument', () => {
    it('returns nothing for a non-array document', () => {
        expect(normalizeArticleDocument(null)).toEqual([]);
        expect(normalizeArticleDocument({ type: 'p' })).toEqual([]);
    });

    it('keeps bold and italic and drops other marks', () => {
        const [paragraph] = normalizeArticleDocument([
            p(
                text('a', { bold: true }),
                text('b', { italic: true, underline: true }),
                text('c', { strikethrough: true }),
            ),
        ]);

        expect(paragraph).toEqual({
            type: 'paragraph',
            children: [
                { type: 'text', text: 'a', bold: true, italic: false },
                { type: 'text', text: 'b', bold: false, italic: true },
                { type: 'text', text: 'c', bold: false, italic: false },
            ],
        });
    });

    it('maps h3-h5 to their level and legacy h1/h2 to h3', () => {
        const levels = normalizeArticleDocument(
            ['h1', 'h2', 'h3', 'h4', 'h5'].map((type) => ({
                type,
                children: [text(type)],
            })),
        ).map((node) => (node.type === 'heading' ? node.level : null));

        expect(levels).toEqual([3, 3, 3, 4, 5]);
    });

    it('keeps http(s) links and unwraps unsafe ones to their text', () => {
        const [paragraph] = normalizeArticleDocument([
            p(
                {
                    type: 'a',
                    url: 'https://hikka.io/anime/x',
                    children: [text('ok')],
                },
                {
                    type: 'a',
                    url: 'javascript:alert(1)',
                    children: [text('bad')],
                },
                { type: 'a', url: '/u/user', children: [text('relative')] },
            ),
        ]);

        expect(paragraph).toEqual({
            type: 'paragraph',
            children: [
                {
                    type: 'link',
                    url: 'https://hikka.io/anime/x',
                    children: [
                        {
                            type: 'text',
                            text: 'ok',
                            bold: false,
                            italic: false,
                        },
                    ],
                },
                { type: 'text', text: 'bad', bold: false, italic: false },
                {
                    type: 'link',
                    url: '/u/user',
                    children: [
                        {
                            type: 'text',
                            text: 'relative',
                            bold: false,
                            italic: false,
                        },
                    ],
                },
            ],
        });
    });

    it('wraps inline children of quotes and spoilers in a paragraph', () => {
        const [quote, spoiler] = normalizeArticleDocument([
            { type: 'blockquote', children: [text('quoted ')] },
            {
                type: 'spoiler',
                children: [p(text('first')), text('loose'), p(text('last'))],
            },
        ]);

        expect(quote).toMatchObject({
            type: 'blockquote',
            children: [{ type: 'paragraph' }],
        });
        expect(spoiler).toMatchObject({
            type: 'spoiler',
            children: [
                { type: 'paragraph' },
                { type: 'paragraph' },
                { type: 'paragraph' },
            ],
        });
    });

    it('keeps inline spoilers inside paragraphs', () => {
        const [paragraph] = normalizeArticleDocument([
            p(text('a '), {
                type: 'spoiler_inline',
                children: [text('secret')],
            }),
        ]);

        expect(paragraph).toMatchObject({
            type: 'paragraph',
            children: [
                { type: 'text', text: 'a ' },
                { type: 'spoiler_inline', children: [{ text: 'secret' }] },
            ],
        });
    });

    it('reads classic lists (ul > li > lic) into items of blocks', () => {
        const [list] = normalizeArticleDocument([
            {
                type: 'ol',
                children: [
                    {
                        type: 'li',
                        children: [{ type: 'lic', children: [text('one')] }],
                    },
                    {
                        type: 'li',
                        children: [
                            { type: 'lic', children: [text('two')] },
                            {
                                type: 'ul',
                                children: [
                                    {
                                        type: 'li',
                                        children: [
                                            {
                                                type: 'lic',
                                                children: [text('nested')],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]);

        expect(list).toMatchObject({
            type: 'list',
            ordered: true,
            items: [
                [{ type: 'paragraph', children: [{ text: 'one' }] }],
                [
                    { type: 'paragraph', children: [{ text: 'two' }] },
                    { type: 'list', ordered: false },
                ],
            ],
        });
    });

    it('keeps up to four https images of a group', () => {
        const image = (url: string) => ({
            type: 'image',
            url,
            children: [text('')],
        });
        const [group] = normalizeArticleDocument([
            {
                type: 'image_group',
                children: [
                    image('https://cdn.hikka.io/1.jpg'),
                    image('http://insecure.example/2.jpg'),
                    image('https://cdn.hikka.io/3.jpg'),
                    image('https://cdn.hikka.io/4.jpg'),
                    image('https://cdn.hikka.io/5.jpg'),
                    image('https://cdn.hikka.io/6.jpg'),
                ],
            },
        ]);

        expect(group).toEqual({
            type: 'images',
            urls: [
                'https://cdn.hikka.io/1.jpg',
                'https://cdn.hikka.io/3.jpg',
                'https://cdn.hikka.io/4.jpg',
                'https://cdn.hikka.io/5.jpg',
            ],
        });
    });

    it('drops a group with no loadable image', () => {
        expect(
            normalizeArticleDocument([
                {
                    type: 'image_group',
                    children: [
                        { type: 'image', url: 'data:image/png;base64,AAA' },
                    ],
                },
            ]),
        ).toEqual([]);
    });

    it('reads YouTube videos and keeps unreadable ones for a fallback', () => {
        const [video, broken] = normalizeArticleDocument([
            {
                type: 'video',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m5s',
            },
            { type: 'video', url: 'https://vimeo.com/1' },
        ]);

        expect(video).toEqual({
            type: 'video',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1m5s',
            video: { id: 'dQw4w9WgXcQ', start: 65 },
        });
        expect(broken).toMatchObject({ type: 'video', video: null });
    });

    it('shows the content of unknown containers such as tables and preview wrappers', () => {
        const blocks = normalizeArticleDocument([
            { type: 'preview', children: [p(text('intro'))] },
            {
                type: 'table',
                children: [
                    {
                        type: 'tr',
                        children: [{ type: 'td', children: [p(text('cell'))] }],
                    },
                ],
            },
            { type: 'unknown-void' },
        ]);

        expect(blocks.map((block) => block.type)).toEqual([
            'paragraph',
            'paragraph',
        ]);
    });

    it('stops at a depth the backend would reject', () => {
        let node: object = p(text('deep'));
        for (let i = 0; i < 40; i++)
            node = { type: 'blockquote', children: [node] };

        expect(() => normalizeArticleDocument([node])).not.toThrow();
    });
});

describe('unwrapArticlePreview', () => {
    it('spreads a leading preview node in place', () => {
        const document = [
            { type: 'preview', children: [{ type: 'p', children: [] }] },
            { type: 'h3', children: [] },
        ];

        expect(unwrapArticlePreview(document)).toEqual([
            { type: 'p', children: [] },
            { type: 'h3', children: [] },
        ]);
    });

    it('returns other documents as they are', () => {
        const document = [{ type: 'p', children: [] }];

        expect(unwrapArticlePreview(document)).toBe(document);
    });
});

describe('articleInlineText', () => {
    it('joins the text of nested inline nodes', () => {
        const [paragraph] = normalizeArticleDocument([
            p(
                text('a'),
                { type: 'a', url: 'https://x.io', children: [text('b')] },
                { type: 'spoiler_inline', children: [text('c')] },
            ),
        ]);

        expect(
            paragraph.type === 'paragraph' &&
                articleInlineText(paragraph.children),
        ).toBe('abc');
    });
});
