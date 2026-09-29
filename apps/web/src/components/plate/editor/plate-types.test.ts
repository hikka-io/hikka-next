import { describe, expect, it } from 'vitest';

import {
    CONTAINER_BLOCK_TYPES,
    ELEMENT_IMAGE,
    ELEMENT_IMAGE_GROUP,
    ELEMENT_IMAGE_PLACEHOLDER,
    ELEMENT_SPOILER,
    ELEMENT_SPOILER_INLINE,
    ELEMENT_VIDEO,
    MAX_IMAGE_COUNT,
} from './plate-types';

describe('plate types', () => {
    it('keeps the stored node type strings', () => {
        expect({
            ELEMENT_IMAGE,
            ELEMENT_IMAGE_GROUP,
            ELEMENT_IMAGE_PLACEHOLDER,
            ELEMENT_VIDEO,
            ELEMENT_SPOILER,
            ELEMENT_SPOILER_INLINE,
        }).toEqual({
            ELEMENT_IMAGE: 'image',
            ELEMENT_IMAGE_GROUP: 'image_group',
            ELEMENT_IMAGE_PLACEHOLDER: 'image_placeholder',
            ELEMENT_VIDEO: 'video',
            ELEMENT_SPOILER: 'spoiler',
            ELEMENT_SPOILER_INLINE: 'spoiler_inline',
        });
    });

    it('caps an image group at four images', () => {
        expect(MAX_IMAGE_COUNT).toBe(4);
    });

    it('treats blockquote and spoiler as the container blocks', () => {
        expect([...CONTAINER_BLOCK_TYPES]).toEqual(['blockquote', 'spoiler']);
        expect(CONTAINER_BLOCK_TYPES).toEqual(
            new Set(['blockquote', 'spoiler']),
        );
        expect(CONTAINER_BLOCK_TYPES).toEqual(
            new Set(['spoiler', 'blockquote']),
        );
    });
});
