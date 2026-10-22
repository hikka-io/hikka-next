import { describe, expect, it } from 'vitest';

import { API_LIMITS } from '@hikka/api';

import {
    COLLECTION_ITEMS_MAX,
    canSaveCollection,
    groupTitleIssues,
    isCommentTooShort,
} from './collection-rules';
import type { Group, Item } from './collection-store';

const TITLE = API_LIMITS.collectionTitle;
const DESCRIPTION = API_LIMITS.collectionDescription;
const COMMENT = API_LIMITS.collectionComment;

const item = (id: string, comment?: string): Item => ({
    id,
    content: { slug: id } as Item['content'],
    comment,
});

const group = (id: string, title: string | null, items: Item[]): Group => ({
    id,
    title,
    items,
});

const VALID = {
    title: 'Колекція',
    description: 'Опис колекції',
    groups: [group('a', null, [item('x')])],
};

describe('canSaveCollection', () => {
    it.each([
        ['a regular title and description', VALID],
        [
            'the minimum lengths',
            {
                ...VALID,
                title: 'a'.repeat(TITLE.min),
                description: 'a'.repeat(DESCRIPTION.min),
            },
        ],
        [
            'the maximum lengths',
            {
                ...VALID,
                title: 'a'.repeat(TITLE.max),
                description: 'a'.repeat(DESCRIPTION.max),
            },
        ],
        [
            'named groups and an empty unnamed one',
            {
                ...VALID,
                groups: [group('a', 'Перша', [item('x')]), group('b', '', [])],
            },
        ],
        [
            'a comment at the minimum',
            {
                ...VALID,
                groups: [
                    group('a', null, [item('x', 'a'.repeat(COMMENT.min))]),
                ],
            },
        ],
    ])('allows saving with %s', (_, state) => {
        expect(canSaveCollection(state)).toBe(true);
    });

    it.each([
        ['no title', { ...VALID, title: undefined }],
        [
            'a title below the minimum',
            { ...VALID, title: 'a'.repeat(TITLE.min - 1) },
        ],
        [
            'a title over the maximum',
            { ...VALID, title: 'a'.repeat(TITLE.max + 1) },
        ],
        ['no description', { ...VALID, description: undefined }],
        [
            'a description below the minimum',
            { ...VALID, description: 'a'.repeat(DESCRIPTION.min - 1) },
        ],
        [
            'a description over the maximum',
            { ...VALID, description: 'a'.repeat(DESCRIPTION.max + 1) },
        ],
        ['no titles', { ...VALID, groups: [group('a', null, [])] }],
        [
            'more titles than the backend takes',
            {
                ...VALID,
                groups: [
                    group(
                        'a',
                        null,
                        Array.from(
                            { length: COLLECTION_ITEMS_MAX + 1 },
                            (_, i) => item(String(i)),
                        ),
                    ),
                ],
            },
        ],
        [
            'a comment below the minimum',
            {
                ...VALID,
                groups: [
                    group('a', null, [item('x', 'a'.repeat(COMMENT.min - 1))]),
                ],
            },
        ],
        [
            'a group without a name',
            { ...VALID, groups: [group('a', ' ', [item('x')])] },
        ],
    ])('blocks saving with %s', (_, state) => {
        expect(canSaveCollection(state)).toBe(false);
    });
});

describe('groupTitleIssues', () => {
    it('reports unnamed and repeated names of groups that have titles', () => {
        const issues = groupTitleIssues([
            group('a', 'Класика', [item('x')]),
            group('b', ' Класика ', [item('y')]),
            group('c', '', [item('z')]),
            group('d', 'Нова', [item('w')]),
        ]);

        expect(Object.fromEntries(issues)).toEqual({
            a: 'duplicate',
            b: 'duplicate',
            c: 'empty',
        });
    });

    it('ignores empty groups, which are not saved', () => {
        expect(
            groupTitleIssues([
                group('a', 'Класика', [item('x')]),
                group('b', 'Класика', []),
                group('c', '', []),
            ]).size,
        ).toBe(0);
    });

    it('has nothing to report for an unnamed collection', () => {
        expect(groupTitleIssues([group('a', null, [item('x')])]).size).toBe(0);
    });
});

describe('isCommentTooShort', () => {
    it.each([
        [undefined, false],
        ['', false],
        ['   ', false],
        ['a'.repeat(COMMENT.min - 1), true],
        [` ${'a'.repeat(COMMENT.min - 1)} `, true],
        ['a'.repeat(COMMENT.min), false],
    ])('%j → %s', (comment, expected) => {
        expect(isCommentTooShort(comment)).toBe(expected);
    });
});
