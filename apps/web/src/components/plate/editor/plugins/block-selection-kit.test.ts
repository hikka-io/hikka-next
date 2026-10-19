import { BlockSelectionPlugin } from '@platejs/selection/react';
import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';

const makeEditor = () =>
    createPlateEditor({
        plugins: ArticleKit,
        nodeId: true,
        value: [
            { type: 'p', children: [{ text: 'Перший' }] },
            { type: 'p', children: [{ text: 'Другий рядок' }] },
        ] as Value,
    });

const selectedIds = (editor: ReturnType<typeof makeEditor>) =>
    editor.getOption(BlockSelectionPlugin, 'selectedIds');

describe('select all', () => {
    it('selects the current line first, then every block', () => {
        const editor = makeEditor();
        editor.tf.select(editor.api.end([1]));

        editor.tf.selectAll();

        expect(editor.selection).toEqual(editor.api.range([1]));
        expect(selectedIds(editor)?.size).toBe(0);

        editor.tf.selectAll();

        expect(selectedIds(editor)?.size).toBe(editor.children.length);
    });

    it('selects every block from an empty line', () => {
        const editor = makeEditor();
        editor.tf.insertNodes(
            { type: 'p', children: [{ text: '' }] },
            { at: [2], select: true },
        );

        editor.tf.selectAll();

        expect(selectedIds(editor)?.size).toBe(editor.children.length);
    });
});
