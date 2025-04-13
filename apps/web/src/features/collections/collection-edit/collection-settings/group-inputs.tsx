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
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';

import { useCollectionContext } from '../../../../services/providers/collection-provider';
import { Group } from '../../../../services/stores/collection-store';
import SortableInput from './sortable-input';

const GroupInputs = () => {
    const items = useCollectionContext((state) => state.groups);
    const setGroups = useCollectionContext((state) => state.setGroups);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeItem = items.find((item) => item.id === active.id);
        const overItem = items.find((item) => item.id === over.id);

        if (!activeItem || !overItem) {
            return;
        }

        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex) {
            setGroups(arrayMove<Group>(items, activeIndex, overIndex));
        }
    };

    const handleGroupTitleChange = (
        id: string | number,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newGroups = items.map((group) => {
            if (group.id === id) {
                return {
                    ...group,
                    title: e.target.value,
                };
            }
            return group;
        });

        setGroups(newGroups);
    };

    const handleRemoveGroup = (id: string | number) => {
        if (items.length === 1 && items[0].isGroup) {
            setGroups([
                {
                    ...items[0],
                    title: null,
                    isGroup: false,
                },
            ]);

            return;
        }

        const newGroups = items.filter((group) => group.id !== id);
        setGroups(newGroups);
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                {items.map((group) => (
                    <SortableInput
                        key={group.id}
                        placeholder="Введіть назву"
                        value={group.title!}
                        id={String(group.id)}
                        className="flex-1"
                        onChange={(e) => handleGroupTitleChange(group.id, e)}
                        onRemove={() => handleRemoveGroup(group.id)}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default GroupInputs;
