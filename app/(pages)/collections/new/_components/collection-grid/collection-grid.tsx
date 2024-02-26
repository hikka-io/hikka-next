'use client';

import React, { useState } from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

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

import SearchModal from '@/components/modals/search-modal';
import BaseCard from '@/components/ui/base-card';

import SortableCard from './_components/ui/sortable-card';

type SortableItem = {
    id: string;
    anime: Hikka.Anime;
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

    const handleAddItem = (anime: Hikka.Anime) => {
        setItems((prev) => [
            ...prev.filter((item) => item.id !== anime.slug),
            {
                id: anime.slug,
                anime,
            },
        ]);
    };

    const handleRemoveItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                    {items.map((item) => (
                        <SortableCard
                            key={item.id}
                            id={item.id}
                            anime={item.anime}
                            onRemove={() => handleRemoveItem(item.id)}
                        />
                    ))}

                    <SearchModal onClick={handleAddItem} type="button">
                        <BaseCard>
                            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-4xl">
                                <MaterialSymbolsAddRounded className="text-muted-foreground" />
                            </div>
                        </BaseCard>
                    </SearchModal>
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default Component;
