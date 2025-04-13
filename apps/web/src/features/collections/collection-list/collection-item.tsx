'use client';

import { formatDistance } from 'date-fns/formatDistance';
import { FC, memo } from 'react';

import ContentCard from '@/components/content-card/content-card';
import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import { IconamoonCommentFill } from '@/components/icons/iconamoon/IconamoonCommentFill';
import MaterialSymbolsDriveFileRenameOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsDriveFileRenameOutlineRounded';
import MaterialSymbolsGridViewRounded from '@/components/icons/material-symbols/MaterialSymbolsGridViewRounded';
import MaterialSymbolsMoreHoriz from '@/components/icons/material-symbols/MaterialSymbolsMoreHoriz';
import Small from '@/components/typography/small';
import { Badge } from '@/components/ui/badge';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import Stack from '@/components/ui/stack';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { cn } from '@/utils/utils';

interface Props {
    collection: API.Collection<API.MainContent & { title?: string }>;
}

const CollectionItem: FC<Props> = ({ collection }) => {
    return (
        <div className="flex flex-col gap-4">
            <HorizontalCard href={`/collections/${collection.reference}`}>
                <HorizontalCardImage
                    href={`/u/${collection.author.username}`}
                    imageRatio={1}
                    image={collection.author.avatar}
                />
                <HorizontalCardContainer>
                    <HorizontalCardTitle>
                        {collection.title}
                    </HorizontalCardTitle>

                    <HorizontalCardDescription className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <MaterialSymbolsGridViewRounded />
                            <Small>{collection.entries}</Small>
                        </div>
                        <div className="flex items-center gap-1">
                            <IconamoonCommentFill />
                            <Small>{collection.comments_count}</Small>
                        </div>
                        <div className="flex items-center gap-1">
                            <BxBxsUpvote />
                            <Small>{collection.vote_score}</Small>
                        </div>
                        <div className="flex items-center gap-1">
                            <MaterialSymbolsDriveFileRenameOutlineRounded />
                            <Small>
                                {formatDistance(
                                    collection.updated * 1000,
                                    Date.now(),
                                    {
                                        addSuffix: true,
                                    },
                                )}
                            </Small>
                        </div>
                    </HorizontalCardDescription>
                </HorizontalCardContainer>
            </HorizontalCard>

            <div className="flex gap-2">
                {collection.spoiler && (
                    <Badge variant="warning">Спойлери</Badge>
                )}
                {collection.nsfw && <Badge variant="destructive">+18</Badge>}
                {collection.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag.toLowerCase()}
                    </Badge>
                ))}
            </div>

            <Stack size={7} className="grid-min-10 py-5">
                {collection.collection.map((item) => (
                    <ContentCard
                        containerClassName={cn(
                            collection.nsfw &&
                                !collection.spoiler &&
                                'spoiler-blur-md',
                        )}
                        className={cn(collection.spoiler && 'spoiler-blur-md')}
                        href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.content.slug}`}
                        key={item.content.slug}
                        image={item.content.image}
                        title={item.content.title}
                        slug={item.content.slug}
                        content_type={item.content_type}
                        watch={
                            'watch' in item.content &&
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                    />
                ))}
                <ContentCard
                    href={`/collections/${collection.reference}`}
                    image={
                        <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                    }
                />
            </Stack>
        </div>
    );
};

export default memo(CollectionItem);
