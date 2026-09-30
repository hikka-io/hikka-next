import type { FC } from 'react';

import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useShallow } from 'zustand/shallow';

import {
    useCollectionContext,
    useCollectionStore,
} from '../../collection-provider';
import SortableInput from './sortable-input';

type GroupTitleInputProps = {
    groupId: string;
};

const GroupTitleInput: FC<GroupTitleInputProps> = ({ groupId }) => {
    const title = useCollectionContext(
        (state) => state.groups.find((g) => g.id === groupId)?.title ?? '',
    );
    const updateGroupTitle = useCollectionContext(
        (state) => state.updateGroupTitle,
    );
    const removeGroup = useCollectionContext((state) => state.removeGroup);

    return (
        <SortableInput
            placeholder="Введіть назву"
            value={title}
            id={groupId}
            className="flex-1"
            onChange={(e) => updateGroupTitle(groupId, e.target.value)}
            onRemove={() => removeGroup(groupId)}
        />
    );
};

const GroupInputs = () => {
    const store = useCollectionStore();
    const groupIds = useCollectionContext(
        useShallow((state) => state.groups.map((group) => group.id)),
    );

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const { groups, reorderGroups } = store.getState();
        const activeIndex = groups.findIndex((g) => g.id === active.id);
        const overIndex = groups.findIndex((g) => g.id === over.id);

        if (
            activeIndex !== -1 &&
            overIndex !== -1 &&
            activeIndex !== overIndex
        ) {
            reorderGroups(activeIndex, overIndex);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={groupIds} strategy={rectSortingStrategy}>
                {groupIds.map((groupId) => (
                    <GroupTitleInput key={groupId} groupId={groupId} />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default GroupInputs;
