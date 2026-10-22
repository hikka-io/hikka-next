import type { UniqueIdentifier } from '@dnd-kit/abstract';

import { findItemGroup, type Group } from '../collection-store';

/** Marks the control a card can be dragged by without the long press. */
export const DRAG_HANDLE_ATTRIBUTE = 'data-drag-handle';

export type CrossGroupMove = {
    fromGroupId: string;
    toGroupId: string;
    insertIndex: number;
};

export type DropMove = {
    groupId: string;
    from: number;
    to: number;
};

export type ItemPosition = {
    groupId: string;
    index: number;
};

export function getCrossGroupMove(
    groups: Group[],
    sourceId: UniqueIdentifier,
    targetId: UniqueIdentifier,
): CrossGroupMove | null {
    const fromGroup = findItemGroup(groups, sourceId);
    const toGroup =
        findItemGroup(groups, targetId) ??
        groups.find((g) => g.id === targetId);

    if (!fromGroup || !toGroup || fromGroup === toGroup) return null;

    const overIndex = toGroup.items.findIndex((item) => item.id === targetId);

    return {
        fromGroupId: fromGroup.id,
        toGroupId: toGroup.id,
        insertIndex: overIndex >= 0 ? overIndex : toGroup.items.length,
    };
}

export function getDropMove(
    groups: Group[],
    itemId: UniqueIdentifier,
    sortableGroup: UniqueIdentifier | undefined,
    sortableIndex: number,
): DropMove | null {
    const group = findItemGroup(groups, itemId);
    if (!group || group.id !== sortableGroup) return null;

    const from = group.items.findIndex((item) => item.id === itemId);
    if (from === sortableIndex) return null;

    return { groupId: group.id, from, to: sortableIndex };
}

export function getItemPositions(groups: Group[]): Map<string, ItemPosition> {
    const positions = new Map<string, ItemPosition>();
    for (const group of groups) {
        group.items.forEach((item, index) => {
            positions.set(String(item.id), { groupId: group.id, index });
        });
    }
    return positions;
}
