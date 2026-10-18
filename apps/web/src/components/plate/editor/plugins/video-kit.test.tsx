import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { ELEMENT_VIDEO } from '../plate-types';
import { VideoKit, VideoPlugin } from './video-kit';

const ID = 'dQw4w9WgXcQ';

type Node = { type?: string; url?: string };

const paragraph = (text: string) => ({ type: 'p', children: [{ text }] });

function makeEditor(texts = ['']) {
    const editor = createPlateEditor({
        plugins: VideoKit,
        value: texts.map(paragraph),
    });
    editor.tf.select(editor.api.end([texts.length - 1]));
    return editor;
}

const shape = (editor: ReturnType<typeof makeEditor>) =>
    (editor.children as (Node & { children: { text?: string }[] })[]).map(
        (node) =>
            node.type === ELEMENT_VIDEO
                ? 'video'
                : `p:${node.children[0]?.text ?? ''}`,
    );

function pasteText(texts: string[], text: string) {
    const editor = makeEditor(texts);

    editor.tf.insertData({
        files: [],
        types: ['text/plain'],
        getData: (format: string) => (format === 'text/plain' ? text : ''),
    } as unknown as DataTransfer);

    return shape(editor);
}

// jsdom has no DataTransfer; Plate only reads getData/types/files off it.
function pasteHtml(html: string) {
    const editor = makeEditor();

    editor.tf.insertData({
        files: [],
        types: ['text/html'],
        getData: (format: string) => (format === 'text/html' ? html : ''),
    } as unknown as DataTransfer);

    return (editor.children as Node[])
        .filter((node) => node.type === ELEMENT_VIDEO)
        .map((node) => node.url);
}

const iframe = (src: string) => `<iframe src="${src}"></iframe>`;

describe('pasting a video', () => {
    it.each([
        [`https://www.youtube.com/embed/${ID}?si=AbCdEf`],
        [`https://www.youtube.com/watch?v=${ID}`],
        [`//www.youtube.com/embed/${ID}`],
    ])('turns a youtube iframe of %j into a normalised video', (src) => {
        expect(pasteHtml(iframe(src))).toEqual([
            `https://youtube.com/watch?v=${ID}`,
        ]);
    });

    it('keeps the start time of a pasted embed', () => {
        expect(
            pasteHtml(iframe(`https://www.youtube.com/embed/${ID}?start=42`)),
        ).toEqual([`https://youtube.com/watch?v=${ID}&t=42`]);
    });

    it.each([
        [`https://www.youtube-nocookie.com/embed/${ID}`],
        [`//www.youtube-nocookie.com/embed/${ID}`],
        [`https://evil.com/?u=https://www.youtube.com/embed/${ID}`],
        [`https://www.youtube.com/shorts/${ID}`],
        ['https://player.vimeo.com/video/123456'],
    ])('does not make a video from an iframe of %j', (src) => {
        expect(pasteHtml(iframe(src))).toEqual([]);
    });
});

describe('inserting a video', () => {
    const insert = (texts: string[]) => {
        const editor = makeEditor(texts);
        editor
            .getTransforms(VideoPlugin)
            .insert.video({ url: `https://youtube.com/watch?v=${ID}` });
        return editor;
    };

    it('takes the place of an empty line and moves the caret below it', () => {
        const editor = insert(['Текст', '']);

        expect(shape(editor)).toEqual(['p:Текст', 'video', 'p:']);
        expect(editor.selection?.anchor.path).toEqual([2, 0]);
    });

    it('goes after a line with text instead of splitting it', () => {
        expect(shape(insert(['Текст']))).toEqual(['p:Текст', 'video', 'p:']);
    });
});

describe('pasting a youtube link', () => {
    const LINK = `https://youtu.be/${ID}`;

    it('turns a bare link on an empty line into a video', () => {
        expect(pasteText(['Текст', ''], LINK)).toEqual([
            'p:Текст',
            'video',
            'p:',
        ]);
    });

    it('keeps a link pasted into text as text', () => {
        expect(pasteText(['Текст '], LINK)).not.toContain('video');
    });
});

describe('pasting a youtube link in the full article editor', () => {
    const paste = (texts: string[], text: string) => {
        const editor = createPlateEditor({
            plugins: ArticleKit,
            value: texts.map(paragraph),
        });
        editor.tf.select(editor.api.end([texts.length - 1]));
        editor.tf.insertData({
            files: [],
            types: ['text/plain'],
            getData: (format: string) => (format === 'text/plain' ? text : ''),
        } as unknown as DataTransfer);

        return editor.children as Node[];
    };

    it('wins over the link plugin on an empty line', () => {
        const nodes = paste(['Текст', ''], `https://youtu.be/${ID}`);

        expect(nodes.map((node) => node.type)).toEqual(['p', 'video', 'p']);
    });

    it('leaves a link in text to the link plugin', () => {
        const nodes = paste(['Текст '], `https://youtu.be/${ID}`);

        expect(nodes.map((node) => node.type)).toEqual(['p']);
    });
});
