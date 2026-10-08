import type { UniqueIdentifier } from '@dnd-kit/abstract';

import type { Group } from '../collection-store';

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

function findGroupContainingItem(
    groups: Group[],
    itemId: UniqueIdentifier,
): Group | undefined {
    return groups.find((g) => g.items.some((item) => item.id === itemId));
}

export function getCrossGroupMove(
    groups: Group[],
    sourceId: UniqueIdentifier,
    targetId: UniqueIdentifier,
): CrossGroupMove | null {
    const fromGroup = findGroupContainingItem(groups, sourceId);
    const toGroup =
        findGroupContainingItem(groups, targetId) ??
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
    const group = findGroupContainingItem(groups, itemId);
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
