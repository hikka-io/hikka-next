import { BaseLinkPlugin } from '@platejs/link';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { getLinkDialogDefaults, linkFormSchema } from './link-dialog';

const accepts = (url: string) => linkFormSchema.safeParse({ url }).success;

describe('link dialog url validation', () => {
    it('accepts full urls, including the ones the content picker inserts', () => {
        expect(
            accepts('https://hikka.io/anime/fullmetal-alchemist-c1cd53'),
        ).toBe(true);
        expect(accepts('http://example.com')).toBe(true);
    });

    it('requires a scheme', () => {
        expect(accepts('/anime/fullmetal-alchemist-c1cd53')).toBe(false);
        expect(accepts('hikka.io/anime/x')).toBe(false);
    });
});

const URL = 'https://hikka.io/characters/kiritsugu-emiya-9b80fd';

function makeEditor() {
    return createPlateEditor({
        plugins: [BaseLinkPlugin],
        value: [
            {
                type: 'p',
                children: [
                    { text: 'see ' },
                    { type: 'a', url: URL, children: [{ text: 'Kiritsugu' }] },
                    { text: '.' },
                ],
            },
        ],
    });
}

describe('link dialog defaults', () => {
    it('prefills the link under a collapsed caret', () => {
        const editor = makeEditor();
        editor.tf.select({ path: [0, 1, 0], offset: 3 });

        expect(getLinkDialogDefaults(editor)).toEqual({
            url: URL,
            text: 'Kiritsugu',
        });
    });

    it('prefills the whole link when part of it is selected', () => {
        const editor = makeEditor();
        editor.tf.select({
            anchor: { path: [0, 1, 0], offset: 1 },
            focus: { path: [0, 1, 0], offset: 4 },
        });

        expect(getLinkDialogDefaults(editor)).toEqual({
            url: URL,
            text: 'Kiritsugu',
        });
    });

    it('uses the selected text outside a link', () => {
        const editor = makeEditor();
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 3 },
        });

        expect(getLinkDialogDefaults(editor)).toEqual({ url: '', text: 'see' });
    });
});
