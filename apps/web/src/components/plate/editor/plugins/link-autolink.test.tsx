import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { LinkKit } from './link-kit';

const URL = 'https://hikka.io/anime';

const linkNodes = (editor: any) => [
    ...editor.api.nodes({ at: [], match: (n: any) => n.type === 'a' }),
];

function makeEditor() {
    const editor = createPlateEditor({
        plugins: LinkKit,
        value: [{ type: 'p', children: [{ text: '' }] }],
    });
    editor.tf.select([0, 0]);
    return editor;
}

// jsdom has no DataTransfer; Plate only reads getData/types/files off it.
function pasteText(editor: any, text: string) {
    editor.tf.insertData({
        files: [],
        types: ['text/plain'],
        getData: (format: string) => (format === 'text/plain' ? text : ''),
    } as unknown as DataTransfer);
}

describe('link autolink input rules', () => {
    it('turns a pasted url into a link node', () => {
        const editor = makeEditor();

        pasteText(editor, URL);

        const links = linkNodes(editor);
        expect(links).toHaveLength(1);
        expect(links[0][0].url).toBe(URL);
        expect(editor.api.string([])).toBe(URL);
    });

    it('keeps the selected text when a url is pasted over it', () => {
        const editor = createPlateEditor({
            plugins: LinkKit,
            value: [{ type: 'p', children: [{ text: 'hikka' }] }],
        });
        editor.tf.select({
            anchor: { path: [0, 0], offset: 0 },
            focus: { path: [0, 0], offset: 5 },
        });

        pasteText(editor, URL);

        const links = linkNodes(editor);
        expect(links).toHaveLength(1);
        expect(links[0][0].url).toBe(URL);
        expect(editor.api.string([])).toBe('hikka');
    });

    it('links a typed url once a space follows it', () => {
        const editor = makeEditor();

        editor.tf.insertText(URL);
        expect(linkNodes(editor)).toHaveLength(0);

        editor.tf.insertText(' ');

        const links = linkNodes(editor);
        expect(links).toHaveLength(1);
        expect(links[0][0].url).toBe(URL);
    });

    it('links a typed url on break', () => {
        const editor = makeEditor();

        editor.tf.insertText(URL);
        editor.tf.insertBreak();

        expect(linkNodes(editor)).toHaveLength(1);
    });

    it('converts markdown [text](url) syntax into a link', () => {
        const editor = makeEditor();

        editor.tf.insertText(`[Hikka](${URL}`);
        editor.tf.insertText(')');

        const links = linkNodes(editor);
        expect(links).toHaveLength(1);
        expect(links[0][0].url).toBe(URL);
        expect(editor.api.string([])).toBe('Hikka');
    });

    it('does not link plain pasted text', () => {
        const editor = makeEditor();

        pasteText(editor, 'not a url');

        expect(linkNodes(editor)).toHaveLength(0);
        expect(editor.api.string([])).toBe('not a url');
    });
});
