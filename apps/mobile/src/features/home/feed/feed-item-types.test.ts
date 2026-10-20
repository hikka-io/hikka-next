import { describe, expect, it } from 'vitest';

import { type FeedItemResponse, getFeedItemKey } from './feed-item-types';

describe('getFeedItemKey', () => {
    it('keys articles by slug and the rest by reference', () => {
        expect(
            getFeedItemKey({
                data_type: 'article',
                slug: 'a-1',
            } as FeedItemResponse),
        ).toBe('a-1');
        expect(
            getFeedItemKey({
                data_type: 'collection',
                reference: 'c-1',
            } as FeedItemResponse),
        ).toBe('c-1');
        expect(
            getFeedItemKey({
                data_type: 'comment',
                reference: 'm-1',
            } as FeedItemResponse),
        ).toBe('m-1');
    });
});
