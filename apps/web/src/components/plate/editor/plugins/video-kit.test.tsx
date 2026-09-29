import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ELEMENT_VIDEO } from '../plate-types';
import { VideoKit } from './video-kit';

const ID = 'dQw4w9WgXcQ';

type Node = { type?: string; url?: string };

function makeEditor() {
    const editor = createPlateEditor({
        plugins: VideoKit,
        value: [{ type: 'p', children: [{ text: '' }] }],
    });
    editor.tf.select([0, 0]);
    return editor;
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
            `https://www.youtube.com/watch?v=${ID}`,
        ]);
    });

    it('keeps the start time of a pasted embed', () => {
        expect(
            pasteHtml(iframe(`https://www.youtube.com/embed/${ID}?start=42`)),
        ).toEqual([`https://www.youtube.com/watch?v=${ID}&t=42`]);
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
