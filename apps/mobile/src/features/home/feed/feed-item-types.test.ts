import { describe, expect, it } from 'vitest';

import {
    type FeedItemResponse,
    getFeedItemKey,
    getFeedItemPath,
} from './feed-item-types';

const article = { data_type: 'article', slug: 'a-1' } as FeedItemResponse;
const collection = {
    data_type: 'collection',
    reference: 'c-1',
} as FeedItemResponse;
const comment = {
    data_type: 'comment',
    reference: 'm-1',
    content_type: 'anime',
    preview: { slug: 'frieren' },
} as unknown as FeedItemResponse;

describe('feed item helpers', () => {
    it('keys articles by slug and the rest by reference', () => {
        expect(getFeedItemKey(article)).toBe('a-1');
        expect(getFeedItemKey(collection)).toBe('c-1');
        expect(getFeedItemKey(comment)).toBe('m-1');
    });

    it('builds the web path for each item type', () => {
        expect(getFeedItemPath(article)).toBe('/articles/a-1');
        expect(getFeedItemPath(collection)).toBe('/collections/c-1');
        expect(getFeedItemPath(comment)).toBe('/comments/anime/frieren/m-1');
    });
});
