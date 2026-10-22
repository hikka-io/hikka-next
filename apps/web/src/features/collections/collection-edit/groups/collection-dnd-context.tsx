import { type FC, memo, type ReactNode, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import type { Plugins, UniqueIdentifier } from '@dnd-kit/abstract';
import { Accessibility, PointerActivationConstraints } from '@dnd-kit/dom';
import {
    type DragDropManager,
    DragDropProvider,
    type DragEndEvent,
    type DragOverEvent,
    DragOverlay,
    PointerSensor,
} from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

import PosterCard from '@/components/content-card/poster-card';
import MaterialSymbolsDragIndicator from '@/components/icons/material-symbols/MaterialSymbolsDragIndicator';
import { useTitle } from '@/services/session';
import { createDragDropManager } from '@/utils/drag-drop-manager';

import {
    useCollectionContext,
    useCollectionStore,
} from '../collection-provider';
import type { Group, Item } from '../collection-store';
import {
    DRAG_HANDLE_ATTRIBUTE,
    GROUP_DRAG_TYPE,
    getCrossGroupMove,
    getDropMove,
    getGroupMove,
    getItemPositions,
    groupSortableId,
} from './card-moves';

type Props = {
    children: ReactNode;
};

const isDragHandle = (target: EventTarget | null) =>
    target instanceof Element &&
    target.closest(`[${DRAG_HANDLE_ATTRIBUTE}]`) !== null;

const SENSORS = [
    PointerSensor.configure({
        // dnd-kit refuses to start a drag from a button, and the handles are buttons.
        preventActivation: (event, source) =>
            !isDragHandle(event.target) &&
            Boolean(PointerSensor.defaults.preventActivation?.(event, source)),
        activationConstraints: (event) => {
            // A handle drags at once; anywhere else a touch has to hold, so the page still scrolls.
            if (isDragHandle(event.target)) return undefined;

            return event.pointerType === 'touch'
                ? [
                      new PointerActivationConstraints.Delay({
                          value: 200,
                          tolerance: 5,
                      }),
                  ]
                : [new PointerActivationConstraints.Distance({ value: 8 })];
        },
    }),
];

// Accessibility rescans every draggable on each registration: quadratic on a 200-card mount.
const PLUGINS = (defaults: Plugins) =>
    defaults.filter((plugin) => plugin !== Accessibility);

function findItem(groups: Group[], itemId: UniqueIdentifier): Item | undefined {
    for (const group of groups) {
        const item = group.items.find((i) => i.id === itemId);
        if (item) return item;
    }
    return undefined;
}

// A sortable copies its index prop only when the prop changes, and optimistic moves rewrite indices behind React.
function syncSortableIndices(manager: DragDropManager, groups: Group[]) {
    const positions = getItemPositions(groups);
    for (const droppable of manager.registry.droppables) {
        if (!isSortable(droppable)) continue;
        const { sortable } = droppable;
        if (sortable.type === GROUP_DRAG_TYPE) {
            sortable.index = groups.findIndex(
                (group) => groupSortableId(group.id) === sortable.id,
            );
            continue;
        }
        const position = positions.get(String(sortable.id));
        if (position && position.groupId === sortable.group) {
            sortable.index = position.index;
        }
    }
}

const OverlayCard = memo<{ id: UniqueIdentifier }>(({ id }) => {
    const content = useCollectionContext(
        (state) => findItem(state.groups, id)?.content,
    );
    const title = useTitle(content);

    if (!content) return null;

    return <PosterCard image={content.image} title={title} />;
});

OverlayCard.displayName = 'OverlayCard';

const OverlayGroup = memo<{ id: UniqueIdentifier }>(({ id }) => {
    const group = useCollectionContext((state) =>
        state.groups.find((entry) => groupSortableId(entry.id) === id),
    );

    if (!group) return null;

    return (
        <div className="surface-glass flex w-fit items-center gap-2 rounded-lg border px-3 py-2 font-semibold shadow-lg">
            <MaterialSymbolsDragIndicator className="size-4 text-muted-foreground" />
            {group.title?.trim() || 'Група без назви'}
            <span className="font-medium text-muted-foreground tabular-nums">
                {group.items.length}
            </span>
        </div>
    );
});

OverlayGroup.displayName = 'OverlayGroup';

const CollectionDndContext: FC<Props> = ({ children }) => {
    const store = useCollectionStore();
    const [manager] = useState(() =>
        createDragDropManager({ sensors: SENSORS, plugins: PLUGINS }),
    );

    // Prevents ping-pong during cross-group drags
    const lastOverContainerRef = useRef<string | null>(null);
    const initialGroupsRef = useRef<Group[] | null>(null);

    const handleDragStart = () => {
        lastOverContainerRef.current = null;
        initialGroupsRef.current = store.getState().groups;
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { source, target } = event.operation;
        if (!source || !target) return;

        const move = getCrossGroupMove(
            store.getState().groups,
            source.id,
            target.id,
        );
        if (!move) return;

        // Cross-group moves go through the store: an optimistic DOM move would reparent a React-owned node.
        event.preventDefault();

        if (lastOverContainerRef.current === move.toGroupId) return;
        lastOverContainerRef.current = move.toGroupId;

        store
            .getState()
            .moveItemToGroup(
                source.id,
                move.fromGroupId,
                move.toGroupId,
                move.insertIndex,
            );
        syncSortableIndices(manager, store.getState().groups);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        lastOverContainerRef.current = null;
        const initialGroups = initialGroupsRef.current;
        initialGroupsRef.current = null;

        const { source } = event.operation;
        if (!isSortable(source)) return;

        if (source.type === GROUP_DRAG_TYPE) {
            const move = event.canceled
                ? null
                : getGroupMove(
                      store.getState().groups,
                      source.id,
                      source.sortable.index,
                  );
            if (!move) return;

            store.getState().reorderGroups(move.from, move.to);
            syncSortableIndices(manager, store.getState().groups);
            return;
        }

        if (event.canceled) {
            const { groups, removeItem, setGroups } = store.getState();
            if (!initialGroups || initialGroups === groups) return;

            // The sorting plugin reverts a cancel to the index the card recorded when it last mounted: remount it so there is nothing to revert.
            const position = getItemPositions(groups).get(String(source.id));
            if (position) {
                flushSync(() => removeItem(position.groupId, source.id));
            }
            setGroups(initialGroups);
            syncSortableIndices(manager, initialGroups);
            return;
        }

        const move = getDropMove(
            store.getState().groups,
            source.id,
            source.sortable.group,
            source.sortable.index,
        );
        if (!move) return;

        store.getState().reorderItem(move.groupId, move.from, move.to);
        syncSortableIndices(manager, store.getState().groups);
    };

    return (
        <DragDropProvider
            manager={manager}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            {children}
            <DragOverlay>
                {(source) =>
                    source.type === GROUP_DRAG_TYPE ? (
                        <OverlayGroup id={source.id} />
                    ) : (
                        <OverlayCard id={source.id} />
                    )
                }
            </DragOverlay>
        </DragDropProvider>
    );
};

export default CollectionDndContext;
