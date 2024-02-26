'use client';

import React, { useState } from 'react';

import {
    DndContext,
    DragEndEvent,
    DragStartEvent,
    PointerSensor,
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

import SortableInput from './ui/sortable-input';

type SortableItem = {
    id: string;
    value: string;
};

const Component = () => {
    const [items, setItems] = useState<SortableItem[]>([]);

    // for drag overlay
    const [activeItem, setActiveItem] = useState<SortableItem>();

    // for input methods detection
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
    );

    // triggered when dragging starts
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveItem(items.find((item) => item.id === active.id));
    };

    // triggered when dragging ends
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
            setItems((prev) =>
                arrayMove<SortableItem>(prev, activeIndex, overIndex),
            );
        }
        setActiveItem(undefined);
    };

    const handleDragCancel = () => {
        setActiveItem(undefined);
    };

    const handleInputChange = (value: string) => {};

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                {items.map((group, i) => (
                    <SortableInput
                        key={i}
                        placeholder="Введіть назву"
                        value={group.value}
                        onChange={() => handleInputChange(group.value)}
                        id={group.id}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default Component;
