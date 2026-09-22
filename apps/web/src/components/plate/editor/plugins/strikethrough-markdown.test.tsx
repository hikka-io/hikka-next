import { renderToStaticMarkup } from 'react-dom/server';

import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor, KEYS, type Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { PlateStatic } from 'platejs/static';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { MarkdownEditorKit } from '../markdown-editor-kit';
import { BaseStrikethroughKit } from './strikethrough-base-kit';

const makeEditor = (plugins: any[] = MarkdownEditorKit, value: Value = []) =>
    createPlateEditor({ plugins, value }) as any;

const serialize = (value: Value) =>
    makeEditor(MarkdownEditorKit, value)
        .getApi(MarkdownPlugin)
        .markdown.serialize();

const deserialize = (markdown: string, plugins?: any[]) =>
    makeEditor(plugins).getApi(MarkdownPlugin).markdown.deserialize(markdown);

const p = (...children: any[]) => ({ type: 'p', children });

const flatText = (nodes: any[]): string =>
    nodes
        .map((node) => ('text' in node ? node.text : flatText(node.children)))
        .join('');

const isStruck = (nodes: any[]): boolean =>
    nodes.some((node) =>
        'text' in node ? node.strikethrough : isStruck(node.children),
    );

describe('serialization', () => {
    it('writes GFM strikethrough', () => {
        const markdown = serialize([
            p({ text: 'a ' }, { text: 's', strikethrough: true }),
        ]);

        expect(markdown.trim()).toBe('a ~~s~~');
    });

    it.each([
        'formatted',
        'a]b',
        'see [x] ok',
        '2*3*4',
    ])('round-trips %j', (text) => {
        const value = [p({ text, strikethrough: true, bold: true })];

        expect(deserialize(serialize(value))).toEqual(value);
    });
});

describe('deserialization', () => {
    it('leaves a single tilde as text', () => {
        const value = deserialize('~5 серій~ і ще');

        expect(flatText(value)).toBe('~5 серій~ і ще');
        expect(isStruck(value)).toBe(false);
    });
});

describe('article editor', () => {
    it('has no strikethrough plugin', () => {
        expect(makeEditor(ArticleKit).plugins[KEYS.strikethrough]).toBe(
            undefined,
        );
    });

    it('keeps pasted text but drops the mark', () => {
        const value = deserialize('a ~~s~~', ArticleKit);

        expect(flatText(value)).toBe('a s');
        expect(isStruck(value)).toBe(false);
    });
});

describe('static rendering', () => {
    it('renders the mark', () => {
        const editor = createSlateEditor({
            plugins: BaseStrikethroughKit,
            value: [p({ text: 's', strikethrough: true })],
        });
        const container = document.createElement('div');
        container.innerHTML = renderToStaticMarkup(
            <PlateStatic editor={editor} />,
        );

        expect(container.querySelector('s')?.textContent).toBe('s');
    });
});

describe('input rules', () => {
    it('turns ~~text~~ into strikethrough', () => {
        const editor = makeEditor(MarkdownEditorKit, [p({ text: '' })]);

        editor.tf.select({ path: [0, 0], offset: 0 });
        for (const char of '~~foo~~') editor.tf.insertText(char);

        expect(editor.children).toEqual([
            p({ text: 'foo', strikethrough: true }),
        ]);
    });
});
