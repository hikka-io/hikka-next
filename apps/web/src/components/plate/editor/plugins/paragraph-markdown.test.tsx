import { MarkdownPlugin } from '@platejs/markdown';
import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { MarkdownEditorKit } from '../markdown-editor-kit';

const makeEditor = (value: Value = []) =>
    createPlateEditor({ plugins: MarkdownEditorKit, value }) as any;

const serialize = (value: Value) =>
    makeEditor(value).getApi(MarkdownPlugin).markdown.serialize();

const deserialize = (markdown: string) =>
    makeEditor().getApi(MarkdownPlugin).markdown.deserialize(markdown);

const p = (...children: any[]) => ({ type: 'p', children });

describe('trailing soft breaks', () => {
    it.each([
        ['a break', [p({ text: 'hello\n' })]],
        ['several breaks', [p({ text: 'hello\n\n' })]],
        [
            'a break with its own marks',
            [p({ text: 'hello' }, { text: '\n', bold: true })],
        ],
        ['the spaces before a break', [p({ text: 'hello  \n' })]],
    ])('drops %s', (_, value) => {
        expect(serialize(value as Value).trim()).toBe('hello');
    });

    it('keeps a break inside the paragraph', () => {
        expect(serialize([p({ text: 'a\nb\n' })]).trim()).toBe('a\\\nb');
    });

    it('drops a break after a link', () => {
        const markdown = serialize([
            p(
                { text: 'see ' },
                {
                    type: 'a',
                    url: 'https://hikka.io',
                    children: [{ text: 'hikka' }],
                },
                { text: '\n' },
            ),
        ]);

        expect(markdown.trim()).toBe('see [hikka](https://hikka.io)');
    });

    it('drops a break inside a blockquote', () => {
        const markdown = serialize([
            { type: 'blockquote', children: [p({ text: 'quote\n' })] },
        ]);

        expect(markdown.trim()).toBe('> quote');
    });

    it('keeps a paragraph of only breaks as a blank line', () => {
        const markdown = serialize([
            p({ text: 'a' }),
            p({ text: '\n' }, { text: '\n', bold: true }),
            p({ text: 'b' }),
        ]);

        expect(deserialize(markdown)).toEqual([
            p({ text: 'a' }),
            p({ text: '' }),
            p({ text: 'b' }),
        ]);
    });
});
