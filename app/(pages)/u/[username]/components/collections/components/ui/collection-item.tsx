import React, { FC, Fragment, memo } from 'react';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';

import Small from '@/components/typography/small';
import HorizontalCard from '@/components/ui/horizontal-card';
import parseTextFromMarkDown from '@/utils/parseTextFromMarkDown';
import { cn } from '@/utils/utils';

interface Props {
    data: API.Collection<API.MainContent>;
    className?: string;
}

const CollectionItem: FC<Props> = ({ data, className }) => {
    const description = parseTextFromMarkDown(data.description);
    const poster = (content: API.MainContent) =>
        content.data_type === 'anime' ? content.poster : content.image;

    const Meta = (
        <Fragment>
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
        </Fragment>
    );

    const TitleMeta = (
        <Fragment>
            {data.spoiler && <div className="size-2 rounded-full bg-warning" />}
            {data.nsfw && (
                <div className="size-2 rounded-full bg-destructive" />
            )}
        </Fragment>
    );

    return (
        <HorizontalCard
            className={className}
            title={data.title}
            href={`/collections/${data.reference}`}
            titleClassName={cn(data.spoiler && 'blur-sm hover:blur-none')}
            image={poster(data.collection[0].content)}
            imageClassName={cn(data.nsfw && 'blur-sm hover:blur-none')}
            description={description}
            descriptionClassName={cn(data.spoiler && 'blur-sm hover:blur-none')}
            meta={Meta}
            titleMeta={TitleMeta}
        />
    );
};

export default memo(CollectionItem);
