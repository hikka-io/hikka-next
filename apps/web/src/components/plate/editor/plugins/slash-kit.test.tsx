import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { SLASH_INPUT_KEY } from './trigger-keys';

const makeEditor = (text = '') => {
    const editor = createPlateEditor({
        plugins: ArticleKit,
        value: [{ type: 'p', children: [{ text }] }] as Value,
    });
    editor.tf.select(editor.api.end([0]));

    return editor;
};

const hasSlashInput = (editor: ReturnType<typeof makeEditor>) =>
    editor.api.some({ at: [], match: { type: SLASH_INPUT_KEY } });

describe('slash menu trigger', () => {
    it('opens on an empty line', () => {
        const editor = makeEditor();

        editor.tf.insertText('/');

        expect(hasSlashInput(editor)).toBe(true);
    });

    it('opens after a space', () => {
        const editor = makeEditor('Текст ');

        editor.tf.insertText('/');

        expect(hasSlashInput(editor)).toBe(true);
    });

    it('stays plain text inside a word or url', () => {
        const editor = makeEditor('https:/');

        editor.tf.insertText('/');

        expect(hasSlashInput(editor)).toBe(false);
        expect(editor.api.string([])).toBe('https://');
    });
});
