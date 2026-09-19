import type { ReactNode } from 'react';

import { ArrowBigUp, Layers, MessageCircle } from 'lucide-react';

import type { CollectionResponse } from '@hikka/api';

import PosterCard from '@/components/content-card/poster-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Link } from '@/utils/navigation';

import type { SearchResultVariant } from '../../types';

type Props = {
    collection: CollectionResponse;
    href: string;
    type?: SearchResultVariant;
};

/**
 * The counters other collection cards render with `StatItem`, as plain markup:
 * `StatItem` is a real button, and this whole row is already one link or button,
 * so nesting it would be invalid and would add tab stops inside a command item.
 * Classes mirror `statItemVariants({ size: 'sm' })`.
 */
const Stat = ({ children }: { children: ReactNode }) => (
    <div className="flex items-center gap-1 text-muted-foreground text-xs [&_svg]:size-3 [&_svg]:shrink-0">
        {children}
    </div>
);

const CollectionCard = ({ collection, href, type }: Props) => {
    const Comp = type === 'button' ? 'button' : Link;
    // A collection can be empty, so there is not always a cover to show.
    const cover = collection.collection[0]?.content.image;

    return (
        <Comp to={href} className="flex w-full items-center gap-4 text-left">
            <div className="w-12">
                <PosterCard
                    containerClassName="rounded-(--base-radius)"
                    imageBlur={collection.nsfw || collection.spoiler}
                    imagePreset="cardXs"
                    image={cover}
                />
            </div>
            <div className="flex w-full flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Label className="line-clamp-2 font-bold">
                        {collection.title}
                    </Label>

                    {collection.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* The whole row is one link/button, so the author is
                        plain text — a nested <a> would be invalid markup and
                        would swallow the command item's onSelect. */}
                    <div className="flex min-w-0 items-center gap-2 text-muted-foreground text-xs">
                        <Avatar className="size-5 shrink-0 rounded-sm">
                            <AvatarImage
                                className="size-5 rounded-sm"
                                src={collection.author.avatar}
                            />
                            <AvatarFallback className="size-5 rounded-sm text-[10px]">
                                {collection.author.username?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate">
                            {collection.author.username}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Stat>
                            <Layers />
                            <small>{collection.entries}</small>
                        </Stat>
                        <Stat>
                            <MessageCircle />
                            <small>{collection.comments_count}</small>
                        </Stat>
                        <Stat>
                            <ArrowBigUp className="size-4!" />
                            <small>{collection.vote_score}</small>
                        </Stat>
                    </div>
                </div>
            </div>
        </Comp>
    );
};

export default CollectionCard;
