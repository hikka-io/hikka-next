import { describe, expect, it } from 'vitest';

import type { CollectionResponse } from '@hikka/api';

import {
    collectionArgsWithEntry,
    collectionArgsWithoutEntry,
} from './collection-entry-args';

type Entry = { slug: string; order: number; label?: string; comment?: string };

function collection(
    entries: Entry[],
    labels_order: string[] = [],
): CollectionResponse {
    return {
        title: 'Осінні сезони',
        description: 'Опис колекції',
        tags: ['осінь'],
        visibility: 'private',
        content_type: 'anime',
        spoiler: false,
        nsfw: true,
        labels_order,
        collection: entries.map((entry) => ({
            content_type: 'anime',
            order: entry.order,
            label: entry.label ?? null,
            comment: entry.comment ?? null,
            content: { slug: entry.slug },
        })),
    } as unknown as CollectionResponse;
}

const slugs = (args: { content: { slug: string }[] }) =>
    args.content.map((entry) => entry.slug);

describe('collectionArgsWithEntry', () => {
    it('appends to an ungrouped collection and keeps its settings', () => {
        const args = collectionArgsWithEntry(
            collection([
                { slug: 'b', order: 2, comment: 'Найкраще' },
                { slug: 'a', order: 1 },
            ]),
            'c',
        );

        expect(args).toEqual({
            title: 'Осінні сезони',
            description: 'Опис колекції',
            tags: ['осінь'],
            visibility: 'private',
            content_type: 'anime',
            spoiler: false,
            nsfw: true,
            labels_order: [],
            content: [
                { slug: 'a', order: 1, label: undefined, comment: undefined },
                { slug: 'b', order: 2, label: undefined, comment: 'Найкраще' },
                { slug: 'c', order: 3, label: undefined },
            ],
        });
    });

    it('inserts at the end of the chosen group and renumbers', () => {
        const args = collectionArgsWithEntry(
            collection(
                [
                    { slug: 'a', order: 1, label: 'Осінь 2023' },
                    { slug: 'b', order: 2, label: 'Осінь 2023' },
                    { slug: 'c', order: 3, label: 'Осінь 2022' },
                ],
                ['Осінь 2023', 'Осінь 2022'],
            ),
            'new',
            'Осінь 2023',
        );

        expect(slugs(args)).toEqual(['a', 'b', 'new', 'c']);
        expect(args.content.map((entry) => entry.order)).toEqual([1, 2, 3, 4]);
        expect(args.content[2].label).toBe('Осінь 2023');
        expect(args.labels_order).toEqual(['Осінь 2023', 'Осінь 2022']);
    });

    it('adds a new group to labels_order', () => {
        const args = collectionArgsWithEntry(
            collection(
                [{ slug: 'a', order: 1, label: 'Шедеври' }],
                ['Шедеври'],
            ),
            'new',
            'Можна глянути',
        );

        expect(slugs(args)).toEqual(['a', 'new']);
        expect(args.labels_order).toEqual(['Шедеври', 'Можна глянути']);
    });

    it('leaves the content unchanged when the title is already there', () => {
        const args = collectionArgsWithEntry(
            collection([
                { slug: 'a', order: 1 },
                { slug: 'b', order: 2 },
            ]),
            'a',
        );

        expect(slugs(args)).toEqual(['a', 'b']);
    });
});

describe('collectionArgsWithoutEntry', () => {
    it('removes the entry and closes the order gap', () => {
        const args = collectionArgsWithoutEntry(
            collection([
                { slug: 'a', order: 1 },
                { slug: 'b', order: 2 },
                { slug: 'c', order: 3 },
            ]),
            'b',
        );

        expect(args.content).toEqual([
            { slug: 'a', order: 1, label: undefined, comment: undefined },
            { slug: 'c', order: 2, label: undefined, comment: undefined },
        ]);
    });

    it('drops a group left empty from labels_order', () => {
        const args = collectionArgsWithoutEntry(
            collection(
                [
                    { slug: 'a', order: 1, label: 'Шедеври' },
                    { slug: 'b', order: 2, label: 'Добре' },
                ],
                ['Шедеври', 'Добре'],
            ),
            'b',
        );

        expect(args.labels_order).toEqual(['Шедеври']);
    });
});
