import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor, type Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { MarkdownEditorKit } from '../markdown-editor-kit';
import { BaseSpoilerKit } from './spoiler-base-kit';
import { ELEMENT_SPOILER, ELEMENT_SPOILER_INLINE } from './spoiler-kit';

const makeEditor = (value: Value = []) =>
    createPlateEditor({ plugins: MarkdownEditorKit, value }) as any;

const serialize = (value: Value) =>
    makeEditor(value).getApi(MarkdownPlugin).markdown.serialize();

const deserialize = (markdown: string) =>
    makeEditor().getApi(MarkdownPlugin).markdown.deserialize(markdown);

const p = (...children: any[]) => ({ type: 'p', children });

const flatText = (nodes: any[]): string =>
    nodes
        .map((node) => ('text' in node ? node.text : flatText(node.children)))
        .join('');

const find = (nodes: any[], type: string): any[] =>
    nodes.flatMap((node) => {
        if (node.type === type) return [node];
        return node.children ? find(node.children, type) : [];
    });

describe('inline spoiler serialization', () => {
    it('writes a text directive', () => {
        const markdown = serialize([
            p(
                { text: 'a ' },
                {
                    type: ELEMENT_SPOILER_INLINE,
                    children: [{ text: 'hidden' }],
                },
                { text: ' b' },
            ),
        ]);

        expect(markdown.trim()).toBe('a :spoiler[hidden] b');
    });

    it('keeps marks inside the directive', () => {
        const markdown = serialize([
            p({
                type: ELEMENT_SPOILER_INLINE,
                children: [{ text: 'hid', bold: true }, { text: 'den' }],
            }),
        ]);

        expect(markdown.trim()).toBe(':spoiler[**hid**den]');
    });

    it('still writes the block spoiler as a container directive', () => {
        const markdown = serialize([
            { type: ELEMENT_SPOILER, children: [p({ text: 'secret' })] },
        ]);

        expect(markdown).toContain(':::spoiler');
        expect(markdown).toContain('secret');
    });
});

describe('inline spoiler deserialization', () => {
    it('reads a text directive with marks', () => {
        const value = deserialize('a :spoiler[**hid**den] b');
        const [spoiler] = find(value, ELEMENT_SPOILER_INLINE);

        expect(spoiler.children).toEqual([
            { bold: true, text: 'hid' },
            { text: 'den' },
        ]);
    });

    it('reads a link inside a text directive', () => {
        const value = deserialize(':spoiler[[l](https://hikka.io)]');
        const [spoiler] = find(value, ELEMENT_SPOILER_INLINE);

        expect(spoiler.children[0].type).toBe('a');
        expect(spoiler.children[0].url).toBe('https://hikka.io');
    });

    it('reads the leaf form as inline too', () => {
        const value = deserialize('::spoiler[hidden]');

        expect(find(value, ELEMENT_SPOILER_INLINE)).toHaveLength(1);
    });

    it('keeps a bare :spoiler as literal text', () => {
        const value = deserialize('plain :spoiler b');

        expect(find(value, ELEMENT_SPOILER_INLINE)).toHaveLength(0);
        expect(flatText(value)).toBe('plain :spoiler b');
    });

    it('still reads the block container directive', () => {
        const value = deserialize('before\n\n:::spoiler\nsecret\n:::\n\nafter');

        expect(find(value, ELEMENT_SPOILER)).toHaveLength(1);
        expect(find(value, ELEMENT_SPOILER_INLINE)).toHaveLength(0);
    });

    it('round-trips both forms together', () => {
        const value = [
            p(
                { text: 'x ' },
                {
                    type: ELEMENT_SPOILER_INLINE,
                    children: [{ text: 'in' }],
                },
            ),
            { type: ELEMENT_SPOILER, children: [p({ text: 'block' })] },
        ];

        const back = deserialize(serialize(value));

        expect(find(back, ELEMENT_SPOILER_INLINE)).toHaveLength(1);
        expect(find(back, ELEMENT_SPOILER)).toHaveLength(1);
    });
});

describe('directive-like text', () => {
    it('keeps an inline spoiler that directly follows a colon', () => {
        const value = [
            p(
                { text: 'a:' },
                {
                    type: ELEMENT_SPOILER_INLINE,
                    children: [{ text: 'hidden' }],
                },
                { text: '' },
            ),
        ];

        expect(
            find(deserialize(serialize(value)), ELEMENT_SPOILER_INLINE),
        ).toHaveLength(1);
    });

    it('keeps the marks around a bare :spoiler', () => {
        expect(deserialize('**:spoiler**')).toEqual([
            p({ bold: true, text: ':spoiler' }),
        ]);
    });

    it('keeps the content of an unknown block directive', () => {
        const value = deserialize(':::note\nkept\n:::');

        expect(value).not.toContain(null);
        expect(flatText(value)).toBe('kept');
    });

    it.each([
        'Re:Zero is great',
        'see :foo[x] ok',
        '::foo[leaf]',
    ])('keeps %j as literal text', (markdown) => {
        expect(flatText(deserialize(markdown))).toBe(markdown);
    });
});

describe('article editor', () => {
    it('reads a pasted inline spoiler', () => {
        const editor = createPlateEditor({ plugins: ArticleKit }) as any;
        const value = editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize('a :spoiler[hidden] b');

        expect(find(value, ELEMENT_SPOILER_INLINE)).toHaveLength(1);
        expect(flatText(value)).toBe('a hidden b');
    });
});

describe('an editor without the inline plugin', () => {
    it('keeps the text but drops the wrapper', () => {
        const editor = createPlateEditor({
            plugins: MarkdownEditorKit.filter(
                (plugin: any) => plugin.key !== ELEMENT_SPOILER_INLINE,
            ),
        }) as any;
        const value = editor
            .getApi(MarkdownPlugin)
            .markdown.deserialize('a :spoiler[hidden] b');

        expect(find(value, ELEMENT_SPOILER_INLINE)).toHaveLength(0);
        expect(flatText(value)).toBe('a hidden b');
    });
});

describe('static rendering', () => {
    it('registers both spoiler nodes', () => {
        const editor = createSlateEditor({ plugins: BaseSpoilerKit }) as any;

        expect(editor.plugins[ELEMENT_SPOILER]).toBeDefined();
        expect(editor.plugins[ELEMENT_SPOILER_INLINE]).toBeDefined();
    });
});
