import type { Value } from 'platejs';
import { describe, expect, it } from 'vitest';

import { getArticleDocument } from './submit-value';

const video = (url: string) => ({
    type: 'video',
    url,
    children: [{ text: '' }],
});

describe('getArticleDocument', () => {
    it('moves saved videos onto the bare youtube.com host', () => {
        const document = [
            { type: 'p', children: [{ text: 'Текст' }] },
            video('https://www.youtube.com/watch?v=9bZkp7q19f0&t=10s'),
            video('https://m.youtube.com/watch?v=dQw4w9WgXcQ'),
        ] as Value;

        expect(getArticleDocument(document).slice(1)).toEqual([
            video('https://youtube.com/watch?v=9bZkp7q19f0&t=10s'),
            video('https://youtube.com/watch?v=dQw4w9WgXcQ'),
        ]);
    });

    it('keeps a video url it cannot read', () => {
        const document = [video('https://example.com/clip')] as Value;

        expect(getArticleDocument(document)).toEqual([
            video('https://example.com/clip'),
        ]);
    });

    it('drops the editor ids', () => {
        const document = [
            { type: 'p', id: 'a1', children: [{ text: 'Текст' }] },
        ] as Value;

        expect(getArticleDocument(document)).toEqual([
            { type: 'p', children: [{ text: 'Текст' }] },
        ]);
    });
});
