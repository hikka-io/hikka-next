import { describe, expect, it } from 'vitest';

import {
    createCollectionStore,
    type Group,
    type Item,
} from '../collection-store';
import { getCrossGroupMove, getDropMove, getItemPositions } from './card-moves';

const item = (id: string) =>
    ({ id, content: { slug: id, data_type: 'anime' } }) as Item;

const group = (id: string, ids: string[]): Group => ({
    id,
    title: id,
    items: ids.map(item),
});

const GROUPS = [
    group('a', ['x', 'y', 's', 'z']),
    group('b', ['w']),
    group('empty', []),
];

describe('getCrossGroupMove', () => {
    it('inserts at the index of the card under the pointer', () => {
        expect(getCrossGroupMove(GROUPS, 's', 'w')).toEqual({
            fromGroupId: 'a',
            toGroupId: 'b',
            insertIndex: 0,
        });
    });

    it('inserts at the end when the pointer is over the group itself', () => {
        expect(getCrossGroupMove(GROUPS, 's', 'b')).toEqual({
            fromGroupId: 'a',
            toGroupId: 'b',
            insertIndex: 1,
        });
        expect(getCrossGroupMove(GROUPS, 'w', 'empty')).toEqual({
            fromGroupId: 'b',
            toGroupId: 'empty',
            insertIndex: 0,
        });
    });

    it('moves the last card out of its group', () => {
        const store = createCollectionStore({ groups: GROUPS });
        const move = getCrossGroupMove(GROUPS, 'w', 'y');

        expect(move).toEqual({
            fromGroupId: 'b',
            toGroupId: 'a',
            insertIndex: 1,
        });
        store.getState().moveItemToGroup('w', 'b', 'a', 1);

        const positions = getItemPositions(store.getState().groups);
        expect(store.getState().groups[1].items).toEqual([]);
        expect(positions.get('w')).toEqual({ groupId: 'a', index: 1 });
        expect(positions.get('y')).toEqual({ groupId: 'a', index: 2 });
    });

    it('ignores moves inside one group and unknown ids', () => {
        expect(getCrossGroupMove(GROUPS, 's', 'x')).toBeNull();
        expect(getCrossGroupMove(GROUPS, 's', 'a')).toBeNull();
        expect(getCrossGroupMove(GROUPS, 'missing', 'w')).toBeNull();
        expect(getCrossGroupMove(GROUPS, 's', 'missing')).toBeNull();
    });
});

describe('getDropMove', () => {
    it('reorders inside the group from the store index to the sortable index', () => {
        expect(getDropMove(GROUPS, 's', 'a', 0)).toEqual({
            groupId: 'a',
            from: 2,
            to: 0,
        });
        expect(getDropMove(GROUPS, 'x', 'a', 3)).toEqual({
            groupId: 'a',
            from: 0,
            to: 3,
        });
    });

    it('does nothing for a drop in place or outside any target', () => {
        expect(getDropMove(GROUPS, 's', 'a', 2)).toBeNull();
        expect(getDropMove(GROUPS, 'w', 'b', 0)).toBeNull();
    });

    it('does nothing when the sortable and the store disagree on the group', () => {
        expect(getDropMove(GROUPS, 's', 'b', 0)).toBeNull();
        expect(getDropMove(GROUPS, 'missing', 'a', 0)).toBeNull();
    });
});

describe('getItemPositions', () => {
    it('maps every card to its group and index', () => {
        expect(getItemPositions(GROUPS)).toEqual(
            new Map([
                ['x', { groupId: 'a', index: 0 }],
                ['y', { groupId: 'a', index: 1 }],
                ['s', { groupId: 'a', index: 2 }],
                ['z', { groupId: 'a', index: 3 }],
                ['w', { groupId: 'b', index: 0 }],
            ]),
        );
    });

    it('keeps a drop in place a no-op after an optimistic move and a move to another group', () => {
        const store = createCollectionStore({ groups: GROUPS });
        const staleIndexOfX = 1;

        store.getState().moveItemToGroup('s', 'a', 'b', 0);
        const { groups } = store.getState();

        expect(getDropMove(groups, 'x', 'a', staleIndexOfX)).toEqual({
            groupId: 'a',
            from: 0,
            to: 1,
        });

        const synced = getItemPositions(groups);
        for (const [index, id] of ['x', 'y', 'z'].entries()) {
            expect(synced.get(id)).toEqual({ groupId: 'a', index });
            expect(getDropMove(groups, id, 'a', index)).toBeNull();
        }
        expect(synced.get('s')).toEqual({ groupId: 'b', index: 0 });
    });
});
