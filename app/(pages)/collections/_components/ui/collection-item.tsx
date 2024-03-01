import React from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import Link from 'next/link';

import AnimeCard from '@/components/anime-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';

interface Props {
    collection: API.Collection;
}

const Component = ({ collection }: Props) => {
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
                    <div className="flex gap-4 items-center">
                        <Label asChild className={cn('line-clamp-1')}>
                            <Link
                                className={cn(
                                    collection.spoiler &&
                                        'blur-sm hover:blur-none',
                                )}
                                href={`/collections/${collection.reference}`}
                            >
                                {collection.title}
                            </Link>
                        </Label>
                        {collection.spoiler && (
                            <Badge variant="warning">Спойлери</Badge>
                        )}
                        {collection.nsfw && (
                            <Badge variant="destructive">+18</Badge>
                        )}
                    </div>
                    <div className="inline-flex gap-2 items-center text-muted-foreground text-xs">
                        <div className="flex gap-1">
                            <MaterialSymbolsGridViewRounded />
                            <Label className="text-xs">
                                {collection.entries}
                            </Label>
                        </div>
                        <div className="flex gap-1">
                            <IconamoonCommentFill />
                            <Label className="text-xs">
                                {collection.comments_count}
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
            {collection.tags.length > 0 && (
                <div className="flex gap-4">
                    {collection.tags.map((tag) => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className={cn(
                                collection.spoiler && 'blur-sm hover:blur-none',
                            )}
                        >
                            {tag.toLowerCase()}
                        </Badge>
                    ))}
                </div>
            )}
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 lg:gap-8 flex-nowrap">
                {collection.collection.map((item, index) => (
                    <AnimeCard
                        containerClassName={cn(
                            collection.nsfw && 'blur-sm hover:blur-none',
                        )}
                        href={`/anime/${item.content.slug}`}
                        key={item.content.slug}
                        poster={item.content.poster}
                        title={
                            item.content.title_ua ||
                            item.content.title_en ||
                            item.content.title_ja
                        }
                        slug={item.content.slug}
                        watch={
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                    />
                ))}
                <BaseCard href={`/collections/${collection.reference}`}>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-4xl">
                        <MaterialSymbolsMoreHoriz className="text-muted-foreground" />
                    </div>
                </BaseCard>
            </div>
        </div>
    );
};

export default Component;
