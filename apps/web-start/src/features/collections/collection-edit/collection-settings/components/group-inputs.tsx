'use client';

import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import { useCollectionContext } from '@/services/providers/collection-provider';

import SortableInput from './sortable-input';

const GroupInputs = () => {
    const groups = useCollectionContext((state) => state.groups);
    const reorderGroups = useCollectionContext((state) => state.reorderGroups);
    const updateGroupTitle = useCollectionContext(
        (state) => state.updateGroupTitle,
    );
    const removeGroup = useCollectionContext((state) => state.removeGroup);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

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
            <SortableContext items={groups} strategy={rectSortingStrategy}>
                {groups.map((group) => (
                    <SortableInput
                        key={group.id}
                        placeholder="Введіть назву"
                        value={group.title ?? ''}
                        id={group.id}
                        className="flex-1"
                        onChange={(e) =>
                            updateGroupTitle(group.id, e.target.value)
                        }
                        onRemove={() => removeGroup(group.id)}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default GroupInputs;
