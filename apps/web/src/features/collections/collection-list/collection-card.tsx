import type { FC } from 'react';

import { type CollectionResponse, ContentTypeEnum } from '@hikka/api';

import { FollowButton, VoteCommentsFooter } from '@/components/action-buttons';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import RelativeTime from '@/components/relative-time';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import CollectionBadges from './collection-badges';
import CollectionPreviewStrip from './collection-preview-strip';
import {
    CARD_ROWS,
    FOLLOW_LABEL_CLASS_NAME,
    STRIP_CONTAINER_CLASS_NAME,
} from './collection-strip';

type Props = {
    collection: CollectionResponse;
    className?: string;
};

const CollectionCard: FC<Props> = ({ collection, className }) => {
    const isDesktop = useIsDesktop();

    return (
        <article className={cn('isolate flex flex-col p-4 sm:px-0', className)}>
            <HorizontalCard
                className={cn(CARD_ROWS.author, STRIP_CONTAINER_CLASS_NAME)}
            >
                <HorizontalCardImage
                    className="w-12"
                    image={collection.author.avatar}
                    imageClassName="sm:rounded-lg"
                    imageRatio={1}
                    to={`/u/${collection.author.username}`}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle
                        href={`/u/${collection.author.username}`}
                    >
                        {collection.author.username}
                    </HorizontalCardTitle>
                    <HorizontalCardContainer className="flex-row items-center">
                        <HorizontalCardDescription>
                            <RelativeTime value={collection.updated} />
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
                <FollowButton
                    iconOnly={!isDesktop}
                    size={isDesktop ? 'md' : 'icon-md'}
                    labelClassName={FOLLOW_LABEL_CLASS_NAME}
                    user={collection.author}
                />
            </HorizontalCard>

            <Link
                to={`/collections/${collection.reference}`}
                className={cn('block', CARD_ROWS.title)}
            >
                <h3 className="line-clamp-2 font-bold text-lg">
                    {collection.title}
                </h3>
            </Link>

            <CollectionBadges
                collection={collection}
                className={CARD_ROWS.tags}
            />

            <CollectionPreviewStrip
                collection={collection}
                className={CARD_ROWS.posters}
            />

            <VoteCommentsFooter
                className={CARD_ROWS.stats}
                commentsCount={collection.comments_count}
                commentsHref={`/comments/collection/${collection.reference}`}
                voteScore={collection.vote_score}
                myScore={collection.my_score}
                contentType={ContentTypeEnum.COLLECTION}
                slug={collection.reference}
            />
        </article>
    );
};

export default CollectionCard;
