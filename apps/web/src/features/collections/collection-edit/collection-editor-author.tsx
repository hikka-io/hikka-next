import type { FC } from 'react';

import type { FollowUserResponse } from '@hikka/api';
import {
    COLLECTION_VISIBILITY,
    CONTENT_COUNT_FORMS,
    getDeclensionWord,
} from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import Card from '@/components/ui/card';

import { useCollectionContext } from './collection-provider';
import CollectionSaveStatus from './collection-save-status';

type Props = {
    author: Pick<FollowUserResponse, 'username' | 'avatar'>;
};

const Dot: FC = () => (
    <div className="size-1 rounded-full bg-muted-foreground" />
);

const CollectionEditorAuthor: FC<Props> = ({ author }) => {
    const visibility = useCollectionContext((state) => state.visibility);
    const contentType = useCollectionContext((state) => state.content_type);
    const count = useCollectionContext((state) =>
        state.groups.reduce((total, group) => total + group.items.length, 0),
    );

    return (
        <Card className="gap-0 overflow-hidden p-0">
            <HorizontalCard className="surface p-4">
                <HorizontalCardImage
                    image={author.avatar}
                    imageClassName="sm:rounded-lg"
                    imageRatio={1}
                    href={`/u/${author.username}`}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle href={`/u/${author.username}`}>
                        {author.username}
                    </HorizontalCardTitle>
                    <HorizontalCardContainer className="flex-row flex-wrap items-center">
                        <HorizontalCardDescription>
                            {COLLECTION_VISIBILITY[visibility].label}
                        </HorizontalCardDescription>
                        <Dot />
                        <HorizontalCardDescription className="tabular-nums">
                            {count}{' '}
                            {getDeclensionWord(
                                count,
                                CONTENT_COUNT_FORMS[contentType],
                            )}
                        </HorizontalCardDescription>
                        {/* Phones carry the save status in the page header. */}
                        <div className="contents max-md:hidden">
                            <Dot />
                            <CollectionSaveStatus />
                        </div>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
            </HorizontalCard>
        </Card>
    );
};

export default CollectionEditorAuthor;
