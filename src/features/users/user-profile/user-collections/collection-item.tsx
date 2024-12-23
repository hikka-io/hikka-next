import { format } from 'date-fns/format';
import { FC, memo } from 'react';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsDriveFileRenameOutlineRounded from '~icons/material-symbols/drive-file-rename-outline-rounded';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';

import Small from '@/components/typography/small';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';

import { cn } from '@/utils/utils';

interface Props {
    data: API.Collection<API.MainContent>;
    className?: string;
}

const CollectionItem: FC<Props> = ({ data, className }) => {
    const image = (content: API.MainContent) =>
        content.data_type === 'anime' ? content.image : content.image;

    return (
        <HorizontalCard href={`/collections/${data.reference}`}>
            <HorizontalCardImage
                image={image(data.collection[0].content)}
                className={cn(data.nsfw && 'spoiler-blur-sm')}
            />
            <HorizontalCardContainer>
                <HorizontalCardTitle
                    className={cn(data.spoiler && 'spoiler-blur-sm')}
                >
                    {data.title}
                    {data.spoiler && (
                        <div className="size-2 rounded-full bg-warning" />
                    )}
                    {data.nsfw && (
                        <div className="size-2 rounded-full bg-destructive" />
                    )}
                </HorizontalCardTitle>
                <HorizontalCardDescription
                    className={cn(data.spoiler && 'spoiler-blur-sm')}
                >
                    {data.description}
                </HorizontalCardDescription>
                <HorizontalCardContainer className="flex-row text-xs text-muted-foreground">
                    <div className="flex gap-1">
                        <MaterialSymbolsGridViewRounded />
                        <Small>{data.entries}</Small>
                    </div>
                    <div className="flex gap-1">
                        <IconamoonCommentFill />
                        <Small>{data.comments_count}</Small>
                    </div>
                    <div className="flex gap-1">
                        <BxBxsUpvote />
                        <Small>{data.vote_score}</Small>
                    </div>
                    <div className="flex gap-1">
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
