import { MarkdownPlugin } from '@platejs/markdown';
import { BlockSelectionPlugin } from '@platejs/selection/react';
import type {
    AnyPluginConfig,
    Descendant,
    TElement,
    TText,
    Value,
} from 'platejs';
import { createPlateEditor, type PlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { getSiteUrl } from '@/utils/url';

import { ArticleKit } from './article-kit';
import { MarkdownEditorKit } from './markdown-editor-kit';
import {
    canTurnInto,
    deselectBlocks,
    insertBlockAtSelection,
    insertContentLink,
    insertMentionLink,
    turnBlockInto,
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

describe('turnBlockInto', () => {
    const turn = (value: Value, type: string) => {
        const editor = createPlateEditor({ plugins: ArticleKit, value });
        turnBlockInto(editor, [0], type);
        const last = editor.children.at(-1);
        // The trailing-block plugin adds an empty paragraph after anything else.
        return last && editor.api.isEmpty(last) && editor.children.length > 1
            ? editor.children.slice(0, -1)
            : editor.children;
    };
    const text = (value: string, marks = {}): TText => ({
        text: value,
        ...marks,
    });
    const p = (...children: Descendant[]): TElement => ({
        type: 'p',
        children,
    });
    const item = (...children: Descendant[]): TElement => ({
        type: 'li',
        children: [{ type: 'lic', children }],
    });

    it('keeps one plain text node in a heading', () => {
        expect(
            turn([p(text('Жирний', { bold: true }), text(' текст'))], 'h3'),
        ).toMatchObject([{ type: 'h3', children: [{ text: 'Жирний текст' }] }]);
    });

    it('wraps a paragraph in a quote', () => {
        expect(turn([p(text('Цитата'))], 'blockquote')).toMatchObject([
            { type: 'blockquote', children: [p(text('Цитата'))] },
        ]);
    });

    it('turns a heading into a list item', () => {
        expect(
            turn([{ type: 'h3', children: [text('Пункт')] }], 'ul'),
        ).toMatchObject([{ type: 'ul', children: [item(text('Пункт'))] }]);
    });

    it('turns every list item into its own block', () => {
        expect(
            turn(
                [
                    {
                        type: 'ol',
                        children: [item(text('Один')), item(text('Два'))],
                    },
                ],
                'p',
            ),
        ).toMatchObject([p(text('Один')), p(text('Два'))]);
    });

    it('swaps one list kind for the other', () => {
        expect(
            turn([{ type: 'ol', children: [item(text('Один'))] }], 'ul'),
        ).toMatchObject([{ type: 'ul', children: [item(text('Один'))] }]);
    });

    it('unwraps a container into its blocks', () => {
        expect(
            turn(
                [
                    {
                        type: 'spoiler',
                        children: [p(text('Один')), p(text('Два'))],
                    },
                ],
                'p',
            ),
        ).toMatchObject([p(text('Один')), p(text('Два'))]);
    });

    it('swaps one container for another', () => {
        expect(
            turn(
                [{ type: 'spoiler', children: [p(text('Один'))] }],
                'blockquote',
            ),
        ).toMatchObject([{ type: 'blockquote', children: [p(text('Один'))] }]);
    });

    it('never nests a container inside one of its own kind', () => {
        const value = [
            {
                type: 'spoiler',
                children: [
                    { type: 'blockquote', children: [p(text('Цитата'))] },
                ],
            },
        ];

        expect(canTurnInto(value[0], 'blockquote')).toBe(false);
        expect(turn(value, 'blockquote')).toMatchObject(value);
    });

    it('turns blocks only into text, list and container kinds', () => {
        expect(canTurnInto(p(text('Текст')), 'image')).toBe(false);
        expect(canTurnInto(p(text('Текст')), 'video')).toBe(false);
    });

    it('offers containers only an unwrap or another container', () => {
        const spoiler = { type: 'spoiler', children: [p(text(''))] };

        expect(canTurnInto(spoiler, 'h3')).toBe(false);
        expect(canTurnInto(spoiler, 'ul')).toBe(false);
        expect(canTurnInto({ type: 'video', url: '', children: [] }, 'p')).toBe(
            false,
        );
    });
});

describe('deselectBlocks', () => {
    it('clears the block selection', () => {
        const editor = createPlateEditor({
            plugins: ArticleKit,
            nodeId: true,
            value: [{ type: 'p', children: [{ text: 'Текст' }] }] as Value,
        });
        const { blockSelection } = editor.getApi(BlockSelectionPlugin);
        blockSelection.set((editor.children[0] as TElement).id as string);

        deselectBlocks(editor);

        expect(
            editor.getOption(BlockSelectionPlugin, 'selectedIds')?.size,
        ).toBe(0);
    });

    it('does nothing in an editor without block selection', () => {
        const editor = createPlateEditor({ plugins: MarkdownEditorKit });

        expect(() => deselectBlocks(editor)).not.toThrow();
    });
});
