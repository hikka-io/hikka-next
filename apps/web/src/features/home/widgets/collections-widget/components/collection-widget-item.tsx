import type { FC } from 'react';

import { ArrowBigUp, Layers, MessageCircle } from 'lucide-react';

import type { CollectionResponse } from '@hikka/api';

import ContentCard from '@/components/content-card/content-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    HorizontalCard,
    HorizontalCardContainer,
} from '@/components/ui/horizontal-card';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

type Props = {
    collection: CollectionResponse;
    hideAuthor?: boolean;
};

const CollectionWidgetItem: FC<Props> = ({ collection }) => {
    const href = `/collections/${collection.reference}`;
    const cover = collection.collection[0]?.content.image;

    return (
        <HorizontalCard className="gap-3 rounded-sm px-2 py-2 transition-colors duration-100 hover:bg-accent">
            <ContentCard
                className="w-14"
                containerClassName="rounded-(--base-radius)"
                imageBlur={collection.nsfw || collection.spoiler}
                imagePreset="cardXs"
                href={href}
                image={cover}
            >
                <div className="absolute bottom-1 left-1 z-10 flex items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5 font-medium text-white text-xs">
                    <Layers className="size-3" />
                    {collection.entries}
                </div>
            </ContentCard>
            <HorizontalCardContainer>
                <Link
                    to={`/u/${collection.author.username}`}
                    className="flex min-w-0 items-center gap-2 text-muted-foreground text-xs transition-colors duration-100 hover:text-foreground"
                >
                    <Avatar className="size-5 shrink-0 rounded-sm">
                        <AvatarImage
                            className="size-5 rounded-sm"
                            src={collection.author.avatar}
                        />
                        <AvatarFallback
                            className="size-5 rounded-sm text-[10px]"
                            title={collection.author.username?.[0]}
                        />
                    </Avatar>
                    <span className="truncate">
                        {collection.author.username}
                    </span>
                </Link>

                <Link
                    to={href}
                    title={collection.title}
                    className={cn(
                        'line-clamp-1 font-medium text-sm leading-snug transition-colors duration-100 hover:text-foreground',
                        collection.spoiler && 'spoiler-blur-sm',
                    )}
                >
                    {collection.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2">
                    <StatItemGroup size="sm" className="flex-1">
                        <StatItem size="sm">
                            <MessageCircle />
                            <small>{collection.comments_count}</small>
                        </StatItem>
                        <StatItem size="sm">
                            <ArrowBigUp className="size-4!" />
                            <small>{collection.vote_score}</small>
                        </StatItem>
                    </StatItemGroup>
                    {collection.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}
                </div>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default CollectionWidgetItem;
