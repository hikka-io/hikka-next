import type { FC } from 'react';

import { CollisionPriority } from '@dnd-kit/abstract';
import { useDroppable } from '@dnd-kit/react';

import PosterCard from '@/components/content-card/poster-card';
import { MaterialSymbolsAddRounded } from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { SearchModal } from '@/features/search';
import { cn } from '@/utils/cn';

import { useCollectionContext } from '../collection-provider';
import type { Item } from '../collection-store';
import SortableCard from './sortable-card';

type Props = {
    groupId: string;
};

const NO_ITEMS: Item[] = [];

const GroupTitle: FC<Props> = ({ groupId }) => {
    const title = useCollectionContext(
        (state) => state.groups.find((g) => g.id === groupId)?.title ?? null,
    );

    if (title === null) return null;

    return (
        <Header>
            <HeaderContainer>
                <HeaderTitle variant="h5">
                    {title.trim().length > 0 ? title : 'Нова група'}
                </HeaderTitle>
            </HeaderContainer>
        </Header>
    );
};

const CollectionEditGrid: FC<Props> = ({ groupId }) => {
    const items = useCollectionContext(
        (state) =>
            state.groups.find((g) => g.id === groupId)?.items ?? NO_ITEMS,
    );
    const content_type = useCollectionContext((state) => state.content_type);
    const addItem = useCollectionContext((state) => state.addItem);
    const removeItem = useCollectionContext((state) => state.removeItem);
    const updateItemComment = useCollectionContext(
        (state) => state.updateItemComment,
    );

    const { ref, isDropTarget } = useDroppable({
        id: groupId,
        collisionPriority: CollisionPriority.Low,
    });

    return (
        <div className="flex flex-col gap-4">
            <GroupTitle groupId={groupId} />
            <div
                ref={ref}
                className={cn(
                    'grid grid-cols-2 gap-4 rounded-lg transition-colors md:grid-cols-5 lg:gap-8',
                    isDropTarget && 'bg-primary/5 ring-2 ring-primary/30',
                )}
            >
                {items.map((item, index) => (
                    <SortableCard
                        key={item.id}
                        id={String(item.id)}
                        index={index}
                        groupId={groupId}
                        content={item.content}
                        comment={item.comment}
                        onRemove={removeItem}
                        onCommentChange={updateItemComment}
                    />
                ))}

                <SearchModal
                    content_type={content_type}
                    onClick={(value) =>
                        addItem(groupId, value as Item['content'])
                    }
                    type="button"
                >
                    <PosterCard
                        image={
                            <MaterialSymbolsAddRounded className="text-4xl text-muted-foreground" />
                        }
                    />
                </SearchModal>
            </div>
        </div>
    );
};

export default CollectionEditGrid;
