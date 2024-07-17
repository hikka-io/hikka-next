'use client';

import formatDistance from 'date-fns/formatDistance';
import Link from 'next/link';
import { FC, memo } from 'react';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsDriveFileRenameOutlineRounded from '~icons/material-symbols/drive-file-rename-outline-rounded';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import ContentCard from '@/components/content-card/content-card';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Stack from '@/components/ui/stack';

import { CONTENT_TYPE_LINKS } from '@/utils/constants';
import { cn } from '@/utils/utils';

interface Props {
    collection: API.Collection<API.MainContent & { title?: string }>;
}

const CollectionItem: FC<Props> = ({ collection }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className={cn('flex gap-2')}>
                <Link
                    href={`/u/${collection.author.username}`}
                    className="w-12"
                >
                    <Avatar className="rounded-md">
                        <AvatarImage
                            className="rounded-md"
                            src={collection.author.avatar}
                        />
                        <AvatarFallback className="rounded-md" />
                    </Avatar>
                </Link>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4">
                        <Link
                            className={cn('text-left')}
                            href={`/collections/${collection.reference}`}
                        >
                            <Label
                                className={cn('line-clamp-1 cursor-pointer')}
                            >
                                {collection.title}
                            </Label>
                        </Link>

                        {collection.spoiler && (
                            <Badge variant="warning">Спойлери</Badge>
                        )}
                        {collection.nsfw && (
                            <Badge variant="destructive">+18</Badge>
                        )}
                    </div>
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="flex gap-1">
                            <MaterialSymbolsGridViewRounded />
                            <Small>{collection.entries}</Small>
                        </div>
                        <div className="flex gap-1">
                            <IconamoonCommentFill />
                            <Small>{collection.comments_count}</Small>
                        </div>
                        <div className="flex gap-1">
                            <BxBxsUpvote />
                            <Small>{collection.vote_score}</Small>
                        </div>
                        <div className="flex gap-1">
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
                    </div>
                </div>
            </div>
            {collection.tags.length > 0 && (
                <div className="flex gap-4">
                    {collection.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag.toLowerCase()}
                        </Badge>
                    ))}
                </div>
            )}
            <Stack size={7} className="grid-min-10 -my-4 py-5">
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
