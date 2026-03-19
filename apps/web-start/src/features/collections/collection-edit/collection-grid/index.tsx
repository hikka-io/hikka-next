'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { CollectionContent } from '@hikka/client';
import { FC } from 'react';

import ContentCard from '@/components/content-card/content-card';
import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { SearchModal } from '@/features/common';

import { useCollectionContext } from '@/services/providers/collection-provider';
import { Group } from '@/services/stores/collection-store';
import { cn } from '@/utils/cn';

import SortableCard from './components/sortable-card';

interface Props {
    group: Group;
}

const CollectionGrid: FC<Props> = ({ group }) => {
    // Subscribe to only this group's items — Zustand skips re-render
    // when the reference hasn't changed (unmodified groups keep same ref)
    const items =
        useCollectionContext(
            (state) => state.groups.find((g) => g.id === group.id)?.items,
        ) ?? [];
    const content_type = useCollectionContext((state) => state.content_type);
    const addItem = useCollectionContext((state) => state.addItem);
    const removeItem = useCollectionContext((state) => state.removeItem);
    const updateItemComment = useCollectionContext(
        (state) => state.updateItemComment,
    );

    const { setNodeRef, isOver } = useDroppable({
        id: group.id,
    });

    return (
        <SortableContext items={items} strategy={rectSortingStrategy}>
            <div className="flex flex-col gap-4">
                {group.title !== null && (
                    <Header>
                        <HeaderContainer>
                            <HeaderTitle variant="h5">
                                {group.title && group.title.trim().length > 0
                                    ? group.title
                                    : 'Нова група'}
                            </HeaderTitle>
                        </HeaderContainer>
                    </Header>
                )}
                <div
                    ref={setNodeRef}
                    className={cn(
                        'grid grid-cols-2 gap-4 rounded-lg transition-colors md:grid-cols-5 lg:gap-8',
                        isOver && 'ring-primary/30 bg-primary/5 ring-2',
                    )}
                >
                    {items.map((item) => (
                        <SortableCard
                            key={item.id}
                            id={String(item.id)}
                            groupId={group.id}
                            content={item.content}
                            comment={item.comment}
                            onRemove={removeItem}
                            onCommentChange={updateItemComment}
                        />
                    ))}

                    <SearchModal
                        content_type={content_type}
                        onClick={(value) =>
                            addItem(
                                group.id,
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
    );
};

export default CollectionGrid;
