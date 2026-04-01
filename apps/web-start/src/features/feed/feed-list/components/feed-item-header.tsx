'use client';

import { ContentTypeEnum, UserResponse } from '@hikka/client';
import { formatDistance } from 'date-fns';
import { FC } from 'react';

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
    [ContentTypeEnum.HISTORY]: 'text-[#e891c0]',
    [ContentTypeEnum.ARTICLE]: 'text-[#78c98d]',
    [ContentTypeEnum.COLLECTION]: 'text-[#6fa8dc]',
    [ContentTypeEnum.COMMENT]: 'text-[#e8a87c]',
};

const TYPE_LABELS: Partial<Record<ContentTypeEnum, string>> = {
    [ContentTypeEnum.HISTORY]: 'Активність',
    [ContentTypeEnum.ARTICLE]: 'Стаття',
    [ContentTypeEnum.COLLECTION]: 'Колекція',
    [ContentTypeEnum.COMMENT]: 'Коментар',
};

interface Props {
    author: UserResponse;
    dataType: ContentTypeEnum;
    created: number;
    extraInfo?: string;
    className?: string;
    showTypeLabel?: boolean;
}

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
                                    'text-xs font-medium',
                                    TYPE_BADGE_STYLES[dataType],
                                )}
                            >
                                {TYPE_LABELS[dataType]}
                            </span>
                            <div className="bg-muted-foreground size-1 rounded-full" />
                        </>
                    )}
                    {extraInfo && (
                        <>
                            <HorizontalCardDescription>
                                {extraInfo}
                            </HorizontalCardDescription>
                            <div className="bg-muted-foreground size-1 rounded-full" />
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
