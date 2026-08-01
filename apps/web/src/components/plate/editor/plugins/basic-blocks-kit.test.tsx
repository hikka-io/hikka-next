import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';

const p = (text: string) => ({ type: 'p', children: [{ text }] });

const h3 = (text: string) => ({ type: 'h3', children: [{ text }] });

const makeEditor = (value: Value) =>
    createPlateEditor({ plugins: ArticleKit, value }) as any;

const types = (editor: any) => editor.children.map((node: any) => node.type);

const blockquoteAt = (editor: any, index: number) => {
    const node = editor.children[index];
    expect(node.type).toBe('blockquote');
    return node;
};

const caretAt = (editor: any, path: number[], offset = 0) =>
    editor.tf.select({
        anchor: { path, offset },
        focus: { path, offset },
    });

describe('blockquote editing rules', () => {
    it('resets a heading inside a blockquote without dropping the blockquote', () => {
        const editor = makeEditor([
            { type: 'blockquote', children: [p('one'), h3('title')] },
        ]);
        caretAt(editor, [0, 1, 0]);

        editor.tf.deleteBackward('character');

        expect(blockquoteAt(editor, 0).children).toEqual([
            p('one'),
            p('title'),
        ]);
    });

    it('resets a heading inside a blockquote on break instead of unwrapping', () => {
        const editor = makeEditor([
            { type: 'blockquote', children: [p('one'), h3('')] },
        ]);
        caretAt(editor, [0, 1, 0]);

        editor.tf.insertBreak();

        expect(blockquoteAt(editor, 0).children).toEqual([p('one'), p('')]);
    });

    it('lifts an empty paragraph out instead of trapping the caret', () => {
        const editor = makeEditor([
            { type: 'blockquote', children: [p('one'), p('')] },
        ]);
        caretAt(editor, [0, 1, 0]);

        editor.tf.insertBreak();

        expect(types(editor)).toEqual(['blockquote', 'p']);
        expect(blockquoteAt(editor, 0).children).toEqual([p('one')]);
    });

    it('lifts the opening paragraph out via backspace', () => {
        const editor = makeEditor([
            { type: 'blockquote', children: [p('one')] },
            p('after'),
        ]);
        caretAt(editor, [0, 0, 0]);

        editor.tf.deleteBackward('character');

        expect(editor.children.slice(0, 2)).toEqual([p('one'), p('after')]);
    });
});
