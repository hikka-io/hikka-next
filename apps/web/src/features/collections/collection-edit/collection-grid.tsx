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
import { CollectionContent } from '@hikka/client';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { SearchModal } from '@/features/modals';

import { useCollectionContext } from '@/services/providers/collection-provider';
import { Group, Item } from '@/services/stores/collection-store';

import SortableCard from './components/sortable-card';

interface Props {
    group: Group;
}

const CollectionGrid: FC<Props> = ({ group }) => {
    const groups = useCollectionContext((state) => state.groups);
    const content_type = useCollectionContext((state) => state.content_type);
    const setGroups = useCollectionContext((state) => state.setGroups);

    const items = groups.find((g) => g.id === group.id)?.items;

    if (!items) {
        return null;
    }

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
            setGroups(
                groups.map((g) => {
                    if (g.id === group.id) {
                        return {
                            ...g,
                            items: arrayMove<Item>(
                                g.items,
                                activeIndex,
                                overIndex,
                            ),
                        };
                    }

                    return g;
                }),
            );
        }
    };

    const handleAddItem = (content: CollectionContent & { title?: string }) => {
        if (JSON.stringify(groups).includes(content.slug)) {
            return;
        }

        setGroups(
            groups.map((g) => {
                if (g.id === group.id) {
                    return {
                        ...g,
                        items: [
                            ...g.items,
                            {
                                id: content.slug,
                                content: content,
                            },
                        ],
                    };
                }

                return g;
            }),
        );
    };

    const handleRemoveItem = (id: string | number) => {
        setGroups(
            groups.map((g) => {
                if (g.id === group.id) {
                    return {
                        ...g,
                        items: g.items.filter((item) => item.id !== id),
                    };
                }

                return g;
            }),
        );
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
                        <Header>
                            <HeaderContainer>
                                <HeaderTitle variant="h5">
                                    {group.title &&
                                    group.title.trim().length > 0
                                        ? group.title
                                        : 'Нова група'}
                                </HeaderTitle>
                            </HeaderContainer>
                        </Header>
                    )}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-8">
                        {items.map((item) => (
                            <SortableCard
                                key={item.id}
                                id={String(item.id)}
                                content={item.content}
                                onRemove={() => handleRemoveItem(item.id)}
                            />
                        ))}

                        <SearchModal
                            content_type={content_type}
                            onClick={(value) =>
                                handleAddItem(
                                    value as CollectionContent & {
                                        title?: string;
                                    },
                                )
                            }
                            type="button"
                        >
                            <ContentCard
                                image={
                                    <MaterialSymbolsAddRounded className="text-muted-foreground text-4xl" />
                                }
                            />
                        </SearchModal>
                    </div>
                </div>
            </SortableContext>
        </DndContext>
    );
};

export default CollectionGrid;
