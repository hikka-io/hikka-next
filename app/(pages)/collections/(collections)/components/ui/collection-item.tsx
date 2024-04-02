'use client';

import React, { memo } from 'react';
import BxBxsUpvote from '~icons/bx/bxs-upvote';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import Link from 'next/link';

import EntryCard from '@/components/entry-card/entry-card';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';
import { CONTENT_TYPE_LINKS } from '@/utils/constants';

interface Props {
    collection: API.Collection;
}

const CollectionItem = ({ collection }: Props) => {
    const poster = (content: API.Anime | API.Character | API.Person) =>
        'poster' in content ? content.poster : content.image;
    const title = (content: API.Anime | API.Character | API.Person) =>
        'title_ua' in content
            ? content.title_ua || content.title_en || content.title_ja
            : content.name_ua || content.name_en;

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
            <div
                className={cn(
                    'grid flex-nowrap gap-4 md:grid-cols-5 lg:grid-cols-7 lg:gap-8',
                    'grid-min-10 no-scrollbar -mx-4 grid-flow-col grid-cols-scroll-7 overflow-x-auto px-4',
                )}
            >
                {collection.collection.map((item) => (
                    <EntryCard
                        containerClassName={cn(
                            collection.nsfw &&
                                !collection.spoiler &&
                                'blur-md transition-all duration-500 hover:blur-none',
                        )}
                        className={cn(
                            collection.spoiler && 'blur-md transition-all duration-500 hover:blur-none',
                        )}
                        href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.content.slug}`}
                        key={item.content.slug}
                        poster={poster(item.content)}
                        title={title(item.content)}
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
                <EntryCard
                    href={`/collections/${collection.reference}`}
                    poster={
                        <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                    }
                />
            </div>
        </div>
    );
};

export default memo(CollectionItem);
