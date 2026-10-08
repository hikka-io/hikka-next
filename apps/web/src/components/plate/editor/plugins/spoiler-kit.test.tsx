import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { MarkdownEditorKit } from '../markdown-editor-kit';
import { ELEMENT_SPOILER, ELEMENT_SPOILER_INLINE } from '../plate-types';
import {
    insertBlock,
    toggleContainerBlock,
    toggleSpoiler,
} from '../transforms';

const p = (text: string) => ({ type: 'p', children: [{ text }] });

const inlineSpoiler = (...children: any[]) => ({
    type: ELEMENT_SPOILER_INLINE,
    children,
});

// Slate pads inline elements with empty text nodes; they carry no meaning here.
const childrenOf = (editor: any, index: number) =>
    editor.children[index].children.filter(
        (child: any) => !('text' in child && child.text === ''),
    );

const SPOILER_TYPES = {
    block: ELEMENT_SPOILER,
    inline: ELEMENT_SPOILER_INLINE,
};

const BlockOnlyKit = MarkdownEditorKit.filter(
    (plugin: any) => plugin.key !== ELEMENT_SPOILER_INLINE,
);

const makeEditor = (value: Value, plugins: any = MarkdownEditorKit) =>
    createPlateEditor({ plugins, value }) as any;

const types = (editor: any) => editor.children.map((node: any) => node.type);

const spoilerAt = (editor: any, index: number) => {
    const node = editor.children[index];
    expect(node.type).toBe(ELEMENT_SPOILER);
    return node;
};

describe('spoiler insert', () => {
    it('replaces an empty paragraph with an empty spoiler', () => {
        const editor = makeEditor([p('')]);
        editor.tf.select([0, 0]);

        insertBlock(editor, ELEMENT_SPOILER);

        expect(spoilerAt(editor, 0).children).toEqual([p('')]);
    });

    it('inserts after a non-empty block without swallowing it', () => {
        const editor = makeEditor([p('aaa')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 3 },
            focus: { path: [0, 0], offset: 3 },
        });

        insertBlock(editor, ELEMENT_SPOILER);

        expect(types(editor)).toEqual(['p', ELEMENT_SPOILER, 'p']);
        expect(editor.children[0]).toEqual(p('aaa'));
    });

    it('does not nest a spoiler inside a spoiler', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('one')] },
        ]);
        editor.tf.select([0, 0, 0]);

        insertBlock(editor, ELEMENT_SPOILER);

        expect(spoilerAt(editor, 0).children).toEqual([p('one')]);
    });
});

describe('spoiler wraps the selection', () => {
    it('wraps every block the selection spans', () => {
        const editor = makeEditor([p('aaa'), p('bbb'), p('ccc')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 1 },
            focus: { path: [1, 0], offset: 2 },
        });

        insertBlock(editor, ELEMENT_SPOILER);

        expect(types(editor)).toEqual([ELEMENT_SPOILER, 'p']);
        expect(spoilerAt(editor, 0).children).toEqual([p('aaa'), p('bbb')]);
        expect(editor.children[1]).toEqual(p('ccc'));
    });

    it('keeps the selection on the wrapped text', () => {
        const editor = makeEditor([p('hello world')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
        });

        insertBlock(editor, ELEMENT_SPOILER);

        expect(editor.api.string(editor.selection)).toBe('hello');
    });

    it('wraps a list without breaking its structure', () => {
        const editor = makeEditor([
            {
                type: 'ul',
                children: [
                    {
                        type: 'li',
                        children: [{ type: 'lic', children: [{ text: 'a' }] }],
                    },
                    {
                        type: 'li',
                        children: [{ type: 'lic', children: [{ text: 'b' }] }],
                    },
                ],
            },
        ]);
        editor.tf.select({
            anchor: { path: [0, 0, 0, 0], offset: 0 },
            focus: { path: [0, 1, 0, 0], offset: 1 },
        });

        insertBlock(editor, ELEMENT_SPOILER);

        const [list] = spoilerAt(editor, 0).children;
        expect(list.type).toBe('ul');
        expect(list.children).toHaveLength(2);
    });
});

describe('spoiler toggle', () => {
    it('unwraps a spoiler the selection is inside', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('one'), p('two')] },
        ]);
        editor.tf.select([0, 1, 0]);

        toggleContainerBlock(editor, ELEMENT_SPOILER);

        expect(editor.children.slice(0, 2)).toEqual([p('one'), p('two')]);
    });

    it('round-trips a multi-block selection', () => {
        const editor = makeEditor([p('aaa'), p('bbb')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [1, 0], offset: 3 },
        });

        toggleContainerBlock(editor, ELEMENT_SPOILER);
        expect(types(editor)).toEqual([ELEMENT_SPOILER, 'p']);

        toggleContainerBlock(editor, ELEMENT_SPOILER);
        expect(editor.children.slice(0, 2)).toEqual([p('aaa'), p('bbb')]);
    });
});

describe('spoiler with no editor selection', () => {
    it('acts on the last selection instead of the document end', () => {
        const editor = makeEditor([p('aaa'), p('bbb'), p('ccc')]);
        editor.tf.select({
            anchor: { path: [1, 0], offset: 0 },
            focus: { path: [1, 0], offset: 3 },
        });
        editor.tf.deselect();

        insertBlock(editor, ELEMENT_SPOILER);

        expect(types(editor)).toEqual(['p', ELEMENT_SPOILER, 'p']);
        expect(spoilerAt(editor, 1).children).toEqual([p('bbb')]);
        expect(editor.children[2]).toEqual(p('ccc'));
    });

    it('falls back to the document end when there is no previous selection', () => {
        const editor = makeEditor([p('aaa')]);

        insertBlock(editor, ELEMENT_SPOILER);

        expect(types(editor)).toEqual(['p', ELEMENT_SPOILER, 'p']);
    });
});

describe('spoiler editing rules', () => {
    it('lifts an empty paragraph out instead of trapping the caret', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('one'), p('')] },
        ]);
        editor.tf.select([0, 1, 0]);

        editor.tf.insertBreak();

        expect(types(editor)).toEqual([ELEMENT_SPOILER, 'p']);
        expect(spoilerAt(editor, 0).children).toEqual([p('one')]);
    });

    it('removes a spoiler that opens the document via backspace', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('one')] },
            p('after'),
        ]);
        editor.tf.select({
            anchor: { path: [0, 0, 0], offset: 0 },
            focus: { path: [0, 0, 0], offset: 0 },
        });

        editor.tf.deleteBackward('character');

        expect(editor.children.slice(0, 2)).toEqual([p('one'), p('after')]);
    });

    it('removes an emptied spoiler via backspace', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('')] },
            p('after'),
        ]);
        editor.tf.select([0, 0, 0]);

        editor.tf.deleteBackward('character');

        expect(types(editor)).toEqual(['p', 'p']);
    });

    it('still merges into the paragraph above deeper in the spoiler', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('one'), p('two')] },
        ]);
        editor.tf.select({
            anchor: { path: [0, 1, 0], offset: 0 },
            focus: { path: [0, 1, 0], offset: 0 },
        });

        editor.tf.deleteBackward('character');

        expect(spoilerAt(editor, 0).children).toEqual([p('onetwo')]);
    });

    it('resets a heading inside a spoiler without dropping the spoiler', () => {
        const editor = makeEditor(
            [
                {
                    type: ELEMENT_SPOILER,
                    children: [
                        p('one'),
                        { type: 'h3', children: [{ text: 't' }] },
                    ],
                },
            ],
            ArticleKit,
        );
        editor.tf.select({
            anchor: { path: [0, 1, 0], offset: 0 },
            focus: { path: [0, 1, 0], offset: 0 },
        });

        editor.tf.deleteBackward('character');

        expect(spoilerAt(editor, 0).children).toEqual([p('one'), p('t')]);
    });

    it('groups loose text into a single paragraph', () => {
        const editor = makeEditor([
            {
                type: ELEMENT_SPOILER,
                children: [{ text: 'one ' }, { text: 'two' }] as any,
            },
        ]);

        editor.tf.normalize({ force: true });

        expect(spoilerAt(editor, 0).children).toEqual([p('one two')]);
    });
});

describe('inline spoiler normalization', () => {
    it('flattens an inline spoiler nested in another', () => {
        const editor = makeEditor([
            {
                type: 'p',
                children: [
                    { text: '' },
                    inlineSpoiler({ text: 'a' }, inlineSpoiler({ text: 'b' })),
                    { text: '' },
                ],
            },
        ]);

        editor.tf.normalize({ force: true });

        expect(childrenOf(editor, 0)).toEqual([inlineSpoiler({ text: 'ab' })]);
    });

    it('drops an inline spoiler that holds no text', () => {
        const editor = makeEditor([
            {
                type: 'p',
                children: [
                    { text: 'a' },
                    inlineSpoiler({ text: '' }),
                    { text: 'b' },
                ],
            },
        ]);

        editor.tf.normalize({ force: true });

        expect(childrenOf(editor, 0)).toEqual([{ text: 'ab' }]);
    });

    it('keeps an inline spoiler whose text sits inside a link', () => {
        const editor = makeEditor([
            {
                type: 'p',
                children: [
                    { text: '' },
                    inlineSpoiler({
                        type: 'a',
                        url: 'https://hikka.io',
                        children: [{ text: 'link' }],
                    }),
                    { text: '' },
                ],
            },
        ]);

        editor.tf.normalize({ force: true });

        expect(childrenOf(editor, 0)).toHaveLength(1);
        expect(childrenOf(editor, 0)[0].type).toBe(ELEMENT_SPOILER_INLINE);
    });
});

describe('spoiler toggle routing', () => {
    it('wraps a selection inside one block as an inline spoiler', () => {
        const editor = makeEditor([p('hello world')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
        });

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(types(editor)).toEqual(['p']);
        expect(childrenOf(editor, 0)).toEqual([
            inlineSpoiler({ text: 'hello' }),
            { text: ' world' },
        ]);
    });

    it('makes a block spoiler from a collapsed caret', () => {
        const editor = makeEditor([p('')]);
        editor.tf.select([0, 0]);

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(spoilerAt(editor, 0).children).toEqual([p('')]);
    });

    it('makes a block spoiler when the selection spans blocks', () => {
        const editor = makeEditor([p('aaa'), p('bbb')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [1, 0], offset: 3 },
        });

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(types(editor)).toEqual([ELEMENT_SPOILER, 'p']);
        expect(spoilerAt(editor, 0).children).toEqual([p('aaa'), p('bbb')]);
    });

    it('unwraps an inline spoiler from a collapsed caret inside it', () => {
        const editor = makeEditor([
            {
                type: 'p',
                children: [
                    { text: 'a' },
                    inlineSpoiler({ text: 'bb' }),
                    { text: 'c' },
                ],
            },
        ]);
        editor.tf.select({ path: [0, 1, 0], offset: 1 });

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(childrenOf(editor, 0)).toEqual([{ text: 'abbc' }]);
    });

    it('round-trips a selection inside one block', () => {
        const editor = makeEditor([p('hello world')]);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 6 },
            focus: { path: [0, 0], offset: 11 },
        });

        toggleSpoiler(editor, SPOILER_TYPES);
        expect(childrenOf(editor, 0)).toEqual([
            { text: 'hello ' },
            inlineSpoiler({ text: 'world' }),
        ]);

        toggleSpoiler(editor, SPOILER_TYPES);
        expect(childrenOf(editor, 0)).toEqual([{ text: 'hello world' }]);
    });

    it('makes an inline spoiler inside a block spoiler', () => {
        const editor = makeEditor([
            { type: ELEMENT_SPOILER, children: [p('hello world')] },
        ]);
        editor.tf.select({
            anchor: { path: [0, 0, 0], offset: 0 },
            focus: { path: [0, 0, 0], offset: 5 },
        });

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(types(editor)).toEqual([ELEMENT_SPOILER, 'p']);
        expect(
            spoilerAt(editor, 0).children[0].children.filter(
                (child: any) => !('text' in child && child.text === ''),
            ),
        ).toEqual([inlineSpoiler({ text: 'hello' }), { text: ' world' }]);
    });
});

describe('articles', () => {
    it('registers the inline plugin', () => {
        const editor = makeEditor([p('a')], ArticleKit);

        expect(editor.plugins[ELEMENT_SPOILER_INLINE]).toBeDefined();
    });

    it('wraps a selection inside one block as an inline spoiler', () => {
        const editor = makeEditor([p('hello world')], ArticleKit);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
        });

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(types(editor)).toEqual(['p']);
        expect(childrenOf(editor, 0)).toEqual([
            inlineSpoiler({ text: 'hello' }),
            { text: ' world' },
        ]);
    });

    it('still makes a block spoiler from a collapsed caret', () => {
        const editor = makeEditor([p('')], ArticleKit);
        editor.tf.select([0, 0]);

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(spoilerAt(editor, 0).children).toEqual([p('')]);
    });
});

describe('an editor without the inline plugin', () => {
    it('falls back to the block spoiler', () => {
        const editor = makeEditor([p('hello world')], BlockOnlyKit);
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
        });

        toggleSpoiler(editor, SPOILER_TYPES);

        expect(types(editor)).toEqual([ELEMENT_SPOILER, 'p']);
        expect(spoilerAt(editor, 0).children).toEqual([p('hello world')]);
    });
});
