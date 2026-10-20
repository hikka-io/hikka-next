import { describe, expect, it } from 'vitest';

import type { CollectionContentResponse } from '@hikka/api';

import { collectionRows, groupCollection } from './collection-rows';

const entry = (slug: string, label: string | null = null) =>
    ({
        label,
        comment: null,
        order: 0,
        content_type: 'anime',
        content: { slug },
    }) as unknown as CollectionContentResponse;

const slugs = (items: CollectionContentResponse[]) =>
    items.map((item) => item.content.slug);

describe('groupCollection', () => {
    it('keeps every entry in one group without labels', () => {
        const groups = groupCollection({
            labels_order: [],
            collection: [entry('a', 'stale'), entry('b')],
        });

        expect(groups).toHaveLength(1);
        expect(slugs(groups[0].items)).toEqual(['a', 'b']);
    });

    it('orders groups by labels_order with unlabelled entries last', () => {
        const groups = groupCollection({
            labels_order: ['second', 'first', 'empty'],
            collection: [
                entry('a', 'first'),
                entry('b'),
                entry('c', 'second'),
                entry('d', 'first'),
                entry('e', 'unlisted'),
            ],
        });

        expect(
            groups.map((group) => [group.label, slugs(group.items)]),
        ).toEqual([
            ['second', ['c']],
            ['first', ['a', 'd']],
            ['unlisted', ['e']],
            [undefined, ['b']],
        ]);
    });
});

describe('collectionRows', () => {
    it('puts a label row before each labelled group and chunks entries', () => {
        const rows = collectionRows(
            [
                {
                    label: 'L',
                    items: ['a', 'b', 'c', 'd'].map((slug) => entry(slug)),
                },
                { items: [entry('e')] },
            ],
            3,
        );

        expect(
            rows.map((row) =>
                row.kind === 'label' ? row.label : slugs(row.items),
            ),
        ).toEqual(['L', ['a', 'b', 'c'], ['d'], ['e']]);
        expect(new Set(rows.map((row) => row.key)).size).toBe(rows.length);
    });
});
