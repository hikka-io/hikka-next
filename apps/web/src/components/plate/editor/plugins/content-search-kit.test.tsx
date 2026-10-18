import { createLinkNode } from '@platejs/link';
import { MarkdownPlugin } from '@platejs/markdown';
import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { MarkdownEditorKit } from '../markdown-editor-kit';
import { CONTENT_SEARCH_INPUT_KEY } from './trigger-keys';

const makeEditor = (value: Value = [{ type: 'p', children: [{ text: '' }] }]) =>
    createPlateEditor({ plugins: MarkdownEditorKit, value }) as any;

const serialize = (editor: any) =>
    editor.getApi(MarkdownPlugin).markdown.serialize();

describe('content search picker', () => {
    it('registers the trigger input node', () => {
        const editor = makeEditor();

        expect(
            editor.getPlugin({ key: CONTENT_SEARCH_INPUT_KEY }),
        ).toBeTruthy();
    });

    it('is available in the article editor too', () => {
        const editor = createPlateEditor({
            plugins: ArticleKit,
            value: [{ type: 'p', children: [{ text: '' }] }],
        }) as any;

        expect(
            editor.getPlugin({ key: CONTENT_SEARCH_INPUT_KEY }),
        ).toBeTruthy();
    });

    it('inserts a full url the markdown viewer already tooltips', () => {
        const editor = makeEditor();
        editor.tf.select([0, 0]);

        editor.tf.insertNodes(
            createLinkNode(editor, {
                url: 'https://hikka.io/anime/fullmetal-alchemist-brotherhood-c1cd53',
                text: 'Сталевий алхімік: Братерство',
            }),
        );

        expect(serialize(editor).trim()).toBe(
            '[Сталевий алхімік: Братерство](https://hikka.io/anime/fullmetal-alchemist-brotherhood-c1cd53)',
        );
    });

    it('keeps an underscore slug unescaped', () => {
        const editor = makeEditor();
        editor.tf.select([0, 0]);

        editor.tf.insertNodes(
            createLinkNode(editor, {
                url: 'https://hikka.io/characters/edward_elric-1a2b3c',
                text: 'Едвард Елрік',
            }),
        );

        const markdown = serialize(editor);

        expect(markdown).not.toContain('\\');
        expect(markdown.trim()).toBe(
            '[Едвард Елрік](https://hikka.io/characters/edward_elric-1a2b3c)',
        );
    });
});
