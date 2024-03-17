'use client';

import React from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';
import MaterialSymbolsGridViewRounded from '~icons/material-symbols/grid-view-rounded';
import MaterialSymbolsMoreHoriz from '~icons/material-symbols/more-horiz';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AnimeCard from '@/components/anime-card';
import Small from '@/components/typography/small';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BaseCard from '@/components/ui/base-card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils';

interface Props {
    collection: API.Collection;
}

const Component = ({ collection }: Props) => {
    const router = useRouter();
    const [spoiler, setSpoiler] = React.useState(collection.spoiler);

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
                        <button
                            className={cn('text-left', spoiler && 'blur-sm')}
                            onClick={(e) => {
                                if (collection.spoiler && spoiler) {
                                    e.preventDefault();
                                    setSpoiler(false);
                                    return;
                                }

                                router.push(
                                    `/collections/${collection.reference}`,
                                );
                            }}
                        >
                            <Label
                                className={cn('line-clamp-1 cursor-pointer')}
                            >
                                {collection.title}
                            </Label>
                        </button>

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
                    </div>
                </div>
            </div>
            {collection.tags.length > 0 && (
                <div className="flex gap-4">
                    {collection.tags.map((tag) => (
                        <Badge
                            key={tag}
                            onClick={() => setSpoiler(false)}
                            variant="secondary"
                            className={cn(spoiler && 'cursor-pointer blur-sm')}
                        >
                            {tag.toLowerCase()}
                        </Badge>
                    ))}
                </div>
            )}
            <div className="grid grid-cols-3 flex-nowrap gap-4 md:grid-cols-5 lg:grid-cols-7 lg:gap-8">
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
                <BaseCard
                    href={`/collections/${collection.reference}`}
                    poster={
                        <MaterialSymbolsMoreHoriz className="text-4xl text-muted-foreground" />
                    }
                />
            </div>
        </div>
    );
};

export default Component;
