import type { Value } from 'platejs';
import { describe, expect, it } from 'vitest';

import { hasPendingUploads } from './has-pending-uploads';
import { stripUploadPlaceholders } from './strip-upload-placeholders';

const doc = (): Value => [
    {
        type: 'image_group',
        children: [
            {
                type: 'image',
                url: 'https://cdn/a.jpg',
                children: [{ text: '' }],
            },
            {
                type: 'image_placeholder',
                id: '1',
                name: 'b.png',
                previewUrl: 'blob:1',
                status: 'error',
                progress: 0,
                children: [{ text: '' }],
            },
        ],
    },
    { type: 'p', children: [{ text: 'hello' }] },
];

describe('stripUploadPlaceholders', () => {
    it('removes image_placeholder nodes at any depth, keeps the rest', () => {
        const out = stripUploadPlaceholders(doc());
        const group = out[0] as any;
        expect(group.children).toHaveLength(1);
        expect(group.children[0].type).toBe('image');
        expect((out[1] as any).children[0].text).toBe('hello');
    });
});

describe('hasPendingUploads', () => {
    it('is false when no placeholder is uploading', () => {
        expect(hasPendingUploads(doc())).toBe(false);
    });

    it('is true when a placeholder is still uploading', () => {
        const d = doc();
        (d[0] as any).children[1].status = 'uploading';
        expect(hasPendingUploads(d)).toBe(true);
    });
});
