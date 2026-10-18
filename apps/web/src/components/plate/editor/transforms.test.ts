import { MarkdownPlugin } from '@platejs/markdown';
import type { AnyPluginConfig, Value } from 'platejs';
import { createPlateEditor, type PlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { getSiteUrl } from '@/utils/url';

import { ArticleKit } from './article-kit';
import { MarkdownEditorKit } from './markdown-editor-kit';
import {
    insertBlockAtSelection,
    insertContentLink,
    insertMentionLink,
} from './transforms';

const SITE = getSiteUrl();

const USER = {
    reference: '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23',
    username: 'second_user',
};

const CONTENT_CASES = [
    [
        ContentTypeEnum.ANIME,
        'fullmetal-alchemist-brotherhood-c1cd53',
        'Сталевий алхімік: Братерство',
        '/anime/fullmetal-alchemist-brotherhood-c1cd53',
    ],
    [
        ContentTypeEnum.MANGA,
        'berserk-fb9fbd',
        'Берсерк',
        '/manga/berserk-fb9fbd',
    ],
    [
        ContentTypeEnum.NOVEL,
        'guimi-zhi-zhu-7059fd',
        'Guimi Zhi Zhu',
        '/novel/guimi-zhi-zhu-7059fd',
    ],
    [
        ContentTypeEnum.CHARACTER,
        'edward_elric-1a2b3c',
        'Едвард Елрік',
        '/characters/edward_elric-1a2b3c',
    ],
    [
        ContentTypeEnum.PERSON,
        'hajime-isayama-55ac2c',
        'Хадзіме Ісаяма',
        '/people/hajime-isayama-55ac2c',
    ],
] as const;

const makeEditor = (plugins: AnyPluginConfig[]) => {
    const editor = createPlateEditor({
        plugins,
        value: [{ type: 'p', children: [{ text: 'див. ' }] }],
    });
    editor.tf.select({ path: [0, 0], offset: 5 });
    return editor;
};

const withLink = (url: string, text: string): Value => [
    {
        type: 'p',
        children: [
            { text: 'див. ' },
            { type: 'a', url, children: [{ text }] },
            { text: '' },
        ],
    },
];

const serialize = (editor: PlateEditor) =>
    editor.getApi(MarkdownPlugin).markdown.serialize();

describe.each([
    ['markdown', MarkdownEditorKit],
    ['article', ArticleKit],
])('%s editor', (_, plugins) => {
    it.each(CONTENT_CASES)(
        'inserts a %s link to the content page',
        (type, slug, text, path) => {
            const editor = makeEditor(plugins);

            insertContentLink(editor, { type, slug, text });

            expect(editor.children).toEqual(withLink(`${SITE}${path}`, text));
        },
    );

    it('inserts a mention that links by reference', () => {
        const editor = makeEditor(plugins);

        insertMentionLink(editor, USER);

        expect(editor.children).toEqual(
            withLink(`${SITE}/u/${USER.reference}`, '@second_user'),
        );
    });
});

describe('comment markdown', () => {
    it('serializes a content link', () => {
        const editor = makeEditor(MarkdownEditorKit);

        insertContentLink(editor, {
            type: ContentTypeEnum.CHARACTER,
            slug: 'edward_elric-1a2b3c',
            text: 'Едвард Елрік',
        });

        expect(serialize(editor)).toBe(
            `див. [Едвард Елрік](${SITE}/characters/edward_elric-1a2b3c)\n`,
        );
    });

    it('serializes a mention with the visible username', () => {
        const editor = makeEditor(MarkdownEditorKit);

        insertMentionLink(editor, USER);

        expect(serialize(editor)).toBe(
            `див. [@second_user](${SITE}/u/${USER.reference})\n`,
        );
    });
});

describe('insertBlockAtSelection', () => {
    const quote = () => ({
        type: 'blockquote',
        children: [{ text: 'Цитата' }],
    });

    const shape = (editor: PlateEditor) =>
        (editor.children as { type: string }[]).map((node) => node.type);

    const editorWith = (value: Value) =>
        createPlateEditor({ plugins: ArticleKit, value });

    it('takes the place of an empty paragraph', () => {
        const editor = editorWith([
            { type: 'p', children: [{ text: 'Текст' }] },
            { type: 'p', children: [{ text: '' }] },
        ]);
        editor.tf.select(editor.api.start([1]));

        expect(insertBlockAtSelection(editor, quote())).toEqual([1]);
        expect(shape(editor)).toEqual(['p', 'blockquote', 'p']);
    });

    it('goes after a block with text instead of splitting it', () => {
        const editor = editorWith([
            { type: 'p', children: [{ text: 'Текст' }] },
        ]);
        editor.tf.select({ path: [0, 0], offset: 2 });

        insertBlockAtSelection(editor, quote());

        expect(editor.api.string([0])).toBe('Текст');
        expect(shape(editor)[1]).toBe('blockquote');
    });

    it('leaves an image group for blocks other than images', () => {
        const editor = editorWith([
            {
                type: 'image_group',
                children: [
                    { type: 'image', url: 'a.jpg', children: [{ text: '' }] },
                ],
            },
        ]);
        editor.tf.select(editor.api.start([0, 0]));

        expect(insertBlockAtSelection(editor, quote())).toEqual([1]);
        expect(shape(editor)).toContain('blockquote');
        expect(
            (
                editor.children[0] as { children: { type: string }[] }
            ).children.map((node) => node.type),
        ).toEqual(['image']);
    });

    it('appends to the end without a selection', () => {
        const editor = editorWith([
            { type: 'p', children: [{ text: 'Текст' }] },
        ]);

        expect(insertBlockAtSelection(editor, quote())).toEqual([1]);
    });
});
