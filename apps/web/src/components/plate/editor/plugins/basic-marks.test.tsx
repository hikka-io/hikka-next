import { renderToStaticMarkup } from 'react-dom/server';

import { MarkdownPlugin } from '@platejs/markdown';
import { createSlateEditor } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { PlateStatic } from 'platejs/static';
import { describe, expect, it } from 'vitest';

import { BaseBasicMarksKit } from './basic-marks-base-kit';
import { BasicMarksKit } from './basic-marks-kit';
import { createMarkdownKit } from './markdown-kit';

describe.each([
    ['comments', [...BasicMarksKit, ...createMarkdownKit({ mentions: true })]],
    ['articles', [...BasicMarksKit, ...createMarkdownKit()]],
])('%s text formatting', (_name, plugins) => {
    it.each([
        { underline: true },
        { strikethrough: true },
        { underline: true, strikethrough: true, bold: true, italic: true },
    ])('preserves %j through Markdown and static rendering', (marks) => {
        const value = [
            { type: 'p', children: [{ text: 'formatted', ...marks }] },
        ];
        const editor = createPlateEditor({ plugins, value });
        const markdown = editor.getApi(MarkdownPlugin).markdown.serialize();

        expect(
            editor.getApi(MarkdownPlugin).markdown.deserialize(markdown),
        ).toEqual(value);

        const reader = createSlateEditor({
            plugins: [...BaseBasicMarksKit, ...createMarkdownKit()],
        });
        const restored = reader
            .getApi(MarkdownPlugin)
            .markdown.deserialize(markdown);
        expect(restored).toEqual(value);
        reader.children = restored;
        const html = renderToStaticMarkup(<PlateStatic editor={reader} />);
        if ('underline' in marks) expect(html).toContain('<u');
        if ('strikethrough' in marks) expect(html).toContain('<s');
    });
});
