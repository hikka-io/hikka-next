import { CollectionContent, CollectionResponse } from '@hikka/client';
import { format } from 'date-fns/format';
import { FC, memo } from 'react';

import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import MaterialSymbolsDriveFileRenameOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsDriveFileRenameOutlineRounded';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import Small from '@/components/typography/small';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { cn } from '@/utils/cn';

interface Props {
    data: CollectionResponse<CollectionContent>;
    className?: string;
}

const CollectionItem: FC<Props> = ({ data, className }) => {
    const image = (content: CollectionContent) =>
        content.data_type === 'anime' ? content.image : content.image;

    return (
        <HorizontalCard
            href={`/collections/${data.reference}`}
            className={className}
        >
            <HorizontalCardImage
                image={image(data.collection[0].content)}
                className={cn(data.nsfw && 'spoiler-blur-sm')}
            />
            <HorizontalCardContainer>
                <div className="inline-flex items-center gap-2">
                    <HorizontalCardTitle
                        className={cn(data.spoiler && 'spoiler-blur-sm')}
                    >
                        {data.title}
                    </HorizontalCardTitle>
                    {data.spoiler && (
                        <div className="size-2 rounded-full bg-warning-foreground" />
                    )}
                    {data.nsfw && (
                        <div className="size-2 rounded-full bg-destructive-foreground" />
                    )}
                </div>
                <HorizontalCardDescription
                    className={cn(data.spoiler && 'spoiler-blur-sm')}
                >
                    {data.description}
                </HorizontalCardDescription>
                <HorizontalCardContainer className="flex-row text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MaterialSymbolsGridViewRounded />
                        <Small>{data.entries}</Small>
                    </div>
                    <div className="flex items-center gap-1">
                        <IconamoonCommentFill />
                        <Small>{data.comments_count}</Small>
                    </div>
                    <div className="flex items-center gap-1">
                        <BxBxsUpvote />
                        <Small>{data.vote_score}</Small>
                    </div>
                    <div className="flex items-center gap-1">
                        <MaterialSymbolsDriveFileRenameOutlineRounded />
                        <Small>
                            {format(new Date(data.updated * 1000), 'd.MM.Y')}
                        </Small>
                    </div>
                </HorizontalCardContainer>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default memo(CollectionItem);
