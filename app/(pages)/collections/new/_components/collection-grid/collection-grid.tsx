'use client';

import React from 'react';
import MaterialSymbolsAddRounded from '~icons/material-symbols/add-rounded';

import {
    DndContext,
    DragEndEvent,
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
import SubHeader from '@/components/sub-header';
import BaseCard from '@/components/ui/base-card';
import {
    Group as CollectionGroup,
    Item as CollectionItem,
    useCollectionContext,
} from '@/services/providers/collection-provider';

import SortableCard from './_components/ui/sortable-card';

interface Props {
    group: CollectionGroup;
}

const Component = ({ group }: Props) => {
    const { groups, setState: setCollectionState } = useCollectionContext();

    const items = groups.find((g) => g.id === group.id)?.items;

    if (!items) {
        return null;
    }

    // for input methods detection
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
    );

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
            setCollectionState!((prev) => ({
                ...prev,
                groups: prev.groups.map((g) => {
                    if (g.id === group.id) {
                        return {
                            ...g,
                            items: arrayMove<CollectionItem>(
                                g.items,
                                activeIndex,
                                overIndex,
                            ),
                        };
                    }

                    return g;
                }),
            }));
        }
    };

    const handleAddItem = (anime: API.Anime) => {
        if (JSON.stringify(groups).includes(anime.slug)) {
            return;
        }

        setCollectionState!((prev) => ({
            ...prev,
            groups: prev.groups.map((g) => {
                if (g.id === group.id) {
                    return {
                        ...g,
                        items: [
                            ...g.items,
                            {
                                id: anime.slug,
                                content: anime,
                            },
                        ],
                    };
                }

                return g;
            }),
        }));
    };

    const handleRemoveItem = (id: string) => {
        // setItems((prev) => prev.filter((item) => item.id !== id));

        setCollectionState!((prev) => ({
            ...prev,
            groups: prev.groups.map((g) => {
                if (g.id === group.id) {
                    return {
                        ...g,
                        items: g.items.filter((item) => item.id !== id),
                    };
                }

                return g;
            }),
        }));
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="flex flex-col gap-4">
                    {group.isGroup && (
                        <SubHeader title={group.title && group.title.trim().length > 0 ? group.title : "Нова група"} variant="h5" />
                    )}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                        {items.map((item) => (
                            <SortableCard
                                key={item.id}
                                id={item.id}
                                anime={item.content}
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
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default Component;
