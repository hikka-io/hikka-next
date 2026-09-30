import { MarkdownPlugin } from '@platejs/markdown';
import type { AnyPluginConfig, Value } from 'platejs';
import { createPlateEditor, type PlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { getSiteUrl } from '@/utils/url';

import { ArticleKit } from './article-kit';
import { MarkdownEditorKit } from './markdown-editor-kit';
import { insertContentLink, insertMentionLink } from './transforms';

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
