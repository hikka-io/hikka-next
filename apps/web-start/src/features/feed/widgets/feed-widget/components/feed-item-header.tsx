import type { FC } from 'react';

import { formatDistance } from 'date-fns';

import { ContentTypeEnum, type UserResponse } from '@hikka/client';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import { FollowButton } from '@/features/common';
import { cn } from '@/utils/cn';

const TYPE_BADGE_STYLES: Partial<Record<ContentTypeEnum, string>> = {
    [ContentTypeEnum.HISTORY]: 'text-feed-history',
    [ContentTypeEnum.ARTICLE]: 'text-feed-article',
    [ContentTypeEnum.COLLECTION]: 'text-feed-collection',
    [ContentTypeEnum.COMMENT]: 'text-feed-comment',
};

const TYPE_LABELS: Partial<Record<ContentTypeEnum, string>> = {
    [ContentTypeEnum.HISTORY]: 'Активність',
    [ContentTypeEnum.ARTICLE]: 'Стаття',
    [ContentTypeEnum.COLLECTION]: 'Колекція',
    [ContentTypeEnum.COMMENT]: 'Коментар',
};

type Props = {
    author: UserResponse;
    dataType: ContentTypeEnum;
    created: number;
    extraInfo?: string;
    className?: string;
    showTypeLabel?: boolean;
};

const FeedItemHeader: FC<Props> = ({
    author,
    dataType,
    created,
    extraInfo,
    className,
    showTypeLabel = true,
}) => {
    return (
        <HorizontalCard className={cn('p-4', className)}>
            <HorizontalCardImage
                className="w-10"
                image={author.avatar}
                imageRatio={1}
                href={`/u/${author.username}`}
            />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle href={`/u/${author.username}`}>
                    {author.username}
                </HorizontalCardTitle>
                <HorizontalCardContainer className="flex-row items-center">
                    {showTypeLabel && (
                        <>
                            <span
                                className={cn(
                                    'font-medium text-xs',
                                    TYPE_BADGE_STYLES[dataType],
                                )}
                            >
                                {TYPE_LABELS[dataType]}
                            </span>
                            <div className="size-1 rounded-full bg-muted-foreground" />
                        </>
                    )}
                    {extraInfo && (
                        <>
                            <HorizontalCardDescription>
                                {extraInfo}
                            </HorizontalCardDescription>
                            <div className="size-1 rounded-full bg-muted-foreground" />
                        </>
                    )}
                    <HorizontalCardDescription>
                        {formatDistance(created * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCardContainer>
            <FollowButton user={author} iconOnly size="icon-md" />
        </HorizontalCard>
    );
};

export default FeedItemHeader;
