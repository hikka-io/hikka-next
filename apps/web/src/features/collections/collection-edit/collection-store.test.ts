import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CollectionResponse } from '@hikka/api';

import {
    collectionState,
    createCollectionStore,
    type Group,
    groupsFromCollection,
    type Item,
} from './collection-store';

describe('createCollectionStore ids', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it.each([
        ['without crypto', undefined],
        ['outside a secure context', {}],
    ])('creates and adds groups %s', (_, crypto) => {
        vi.stubGlobal('crypto', crypto);

        const store = createCollectionStore();
        store.getState().addGroup();
        store.getState().addGroup();

        const ids = store.getState().groups.map((group) => group.id);
        expect(ids).toHaveLength(2);
        expect(new Set(ids).size).toBe(2);
        for (const id of ids) expect(id).toEqual(expect.any(String));
    });
});

const content = (slug: string) =>
    ({ slug, data_type: 'anime' }) as Item['content'];

const entry = (slug: string, label: string | null, comment?: string) => ({
    comment: comment ?? null,
    label,
    content_type: 'anime',
    order: 0,
    content: content(slug),
});

const collection = (entries: ReturnType<typeof entry>[]) =>
    ({
        title: 'Колекція',
        description: 'Опис',
        content_type: 'manga',
        nsfw: true,
        spoiler: true,
        visibility: 'unlisted',
        tags: ['tag'],
        reference: 'reference',
        labels_order: [],
        collection: entries,
    }) as unknown as CollectionResponse;

describe('groupsFromCollection', () => {
    it('groups entries by label in the order they appear', () => {
        const groups = groupsFromCollection(
            collection([
                entry('a', 'Перша'),
                entry('b', null, 'коментар'),
                entry('c', 'Перша'),
                entry('d', 'Друга'),
            ]),
        );

        expect(groups).toEqual([
            {
                id: 'Перша',
                title: 'Перша',
                items: [
                    { id: 'a', content: content('a'), comment: undefined },
                    { id: 'c', content: content('c'), comment: undefined },
                ],
            },
            {
                id: 'default',
                title: null,
                items: [
                    { id: 'b', content: content('b'), comment: 'коментар' },
                ],
            },
            {
                id: 'Друга',
                title: 'Друга',
                items: [{ id: 'd', content: content('d'), comment: undefined }],
            },
        ]);
        expect(groupsFromCollection(collection([]))).toEqual([]);
    });

    it('keeps the ids and objects of unchanged groups and items', () => {
        const previous: Group[] = [
            {
                id: 'local',
                title: 'Перша',
                items: [
                    { id: 'a', content: content('a') },
                    { id: 'b', content: content('b'), comment: 'стара' },
                ],
            },
            { id: 'other', title: 'Друга', items: [] },
        ];

        const groups = groupsFromCollection(
            collection([
                entry('a', 'Перша'),
                entry('b', 'Перша', 'нова'),
                entry('c', 'Третя'),
            ]),
            previous,
        );

        expect(groups.map((group) => group.id)).toEqual(['local', 'Третя']);
        expect(groups[0].items[0]).toBe(previous[0].items[0]);
        expect(groups[0].items[1]).toEqual({
            id: 'b',
            content: content('b'),
            comment: 'нова',
        });

        const unchanged = groupsFromCollection(
            collection([entry('a', 'Перша'), entry('b', 'Перша', 'стара')]),
            previous,
        );
        expect(unchanged[0]).toBe(previous[0]);
    });

    it('never reuses an id twice', () => {
        const groups = groupsFromCollection(
            collection([entry('a', 'Б'), entry('b', 'А')]),
            [{ id: 'А', title: 'Б', items: [] }],
        );

        expect(groups[0].id).toBe('А');
        expect(groups[1].id).not.toBe('А');
    });
});

describe('collectionState', () => {
    it('takes only the editable fields', () => {
        expect(collectionState(collection([entry('a', null)]))).toEqual({
            title: 'Колекція',
            description: 'Опис',
            content_type: 'manga',
            groups: [
                {
                    id: 'default',
                    title: null,
                    items: [
                        { id: 'a', content: content('a'), comment: undefined },
                    ],
                },
            ],
            nsfw: true,
            spoiler: true,
            visibility: 'unlisted',
            tags: ['tag'],
        });
    });

    it('round-trips through the store into the same request body', () => {
        const source = collection([
            entry('a', 'Перша', 'коментар'),
            entry('b', 'Друга'),
            entry('c', 'Перша'),
        ]);
        const store = createCollectionStore(collectionState(source));

        expect(store.getState().getApiData()).toEqual({
            title: 'Колекція',
            description: 'Опис',
            content_type: 'manga',
            nsfw: true,
            spoiler: true,
            visibility: 'unlisted',
            labels_order: ['Перша', 'Друга'],
            content: [
                { comment: 'коментар', label: 'Перша', order: 1, slug: 'a' },
                { comment: undefined, label: 'Перша', order: 2, slug: 'c' },
                { comment: undefined, label: 'Друга', order: 3, slug: 'b' },
            ],
            tags: ['tag'],
        });
    });
});

describe('applySaved', () => {
    const saved = collection([entry('a', 'Перша', 'з сервера')]);

    it('takes the saved collection when nothing changed since sending', () => {
        const store = createCollectionStore(
            collectionState(collection([entry('a', 'Перша')])),
        );
        const sent = store.getState().getApiData();

        store.getState().applySaved(sent, saved);

        expect(store.getState().groups[0].items[0].comment).toBe('з сервера');
    });

    it('keeps edits made while the request was in flight', () => {
        const store = createCollectionStore(
            collectionState(collection([entry('a', 'Перша')])),
        );
        const sent = store.getState().getApiData();
        store.getState().setTitle('Нова назва');

        store.getState().applySaved(sent, saved);

        expect(store.getState().title).toBe('Нова назва');
        expect(store.getState().groups[0].items[0].comment).toBeUndefined();
    });
});

describe('card and group moves', () => {
    const item = (id: string): Item => ({ id, content: content(id) });
    const ids = (groups: Group[]) =>
        groups.map((group) => group.items.map((i) => i.id));
    const create = () =>
        createCollectionStore({
            groups: [
                {
                    id: 'a',
                    title: 'А',
                    items: [item('x'), item('y'), item('z')],
                },
                { id: 'b', title: 'Б', items: [item('w')] },
                { id: 'c', title: 'В', items: [] },
            ],
        });

    it('moves a card into another group at the insert index', () => {
        const store = create();

        store.getState().moveItemToGroup('y', 'a', 'b', 0);
        expect(ids(store.getState().groups)).toEqual([
            ['x', 'z'],
            ['y', 'w'],
            [],
        ]);

        store.getState().moveItemToGroup('x', 'a', 'b', 2);
        expect(ids(store.getState().groups)).toEqual([
            ['z'],
            ['y', 'w', 'x'],
            [],
        ]);
    });

    it('moves a card into an empty group and the last card out of a group', () => {
        const store = create();
        const moved = store.getState().groups[1].items[0];

        store.getState().moveItemToGroup('w', 'b', 'c', 0);

        expect(ids(store.getState().groups)).toEqual([
            ['x', 'y', 'z'],
            [],
            ['w'],
        ]);
        expect(store.getState().groups[2].items[0]).toBe(moved);
    });

    it('ignores a move from a group that does not hold the card', () => {
        const store = create();
        const before = store.getState();

        store.getState().moveItemToGroup('w', 'a', 'c', 0);
        store.getState().moveItemToGroup('w', 'missing', 'c', 0);

        expect(store.getState()).toBe(before);
    });

    it('reorders cards inside a group and keeps the items for a move in place', () => {
        const store = create();

        store.getState().reorderItem('a', 0, 2);
        expect(ids(store.getState().groups)[0]).toEqual(['y', 'z', 'x']);

        const { items } = store.getState().groups[0];
        store.getState().reorderItem('a', 1, 1);
        expect(store.getState().groups[0].items).toBe(items);
        expect(ids(store.getState().groups)[1]).toEqual(['w']);
    });

    it('reorders groups and keeps them for a move in place', () => {
        const store = create();

        store.getState().reorderGroups(0, 2);
        expect(store.getState().groups.map((group) => group.id)).toEqual([
            'b',
            'c',
            'a',
        ]);

        const { groups } = store.getState();
        store.getState().reorderGroups(1, 1);
        expect(store.getState().groups).toBe(groups);
    });
});
