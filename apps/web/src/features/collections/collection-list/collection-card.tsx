import type { FC } from 'react';

import { ArrowBigUp, MessageCircle } from 'lucide-react';

import type { CollectionResponse } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
import { contentEntity } from '@/components/content-card';
import EntityCard from '@/components/content-card/entity-card';
import PosterCard from '@/components/content-card/poster-card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import RelativeTime from '@/components/relative-time';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import Image from '@/components/ui/image';
import Stack, { type StackSize } from '@/components/ui/stack';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

type Props = {
    collection: CollectionResponse;
    className?: string;
    maxPreviewItems: number;
};

const CollectionCard: FC<Props> = ({
    collection,
    className,
    maxPreviewItems = 6,
}) => {
    const isDesktop = useIsDesktop();
    const { preferences } = useSessionUI();
    const previewItems = collection.collection.slice(0, maxPreviewItems);
    const remainingCount = collection.entries - maxPreviewItems;
    const previewItem =
        collection.collection.length > maxPreviewItems
            ? collection.collection[maxPreviewItems]
            : collection.collection[collection.collection.length - 1];

    return (
        <Card
            className={cn(
                'isolate -mx-4 overflow-hidden rounded-none border-x-0 md:mx-0 md:rounded-lg md:border-x',
                className,
            )}
        >
            <HorizontalCard>
                <HorizontalCardImage
                    className="w-12"
                    image={collection.author.avatar}
                    imageRatio={1}
                    to={`/u/${collection.author.username}`}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle
                        href={`/u/${collection.author.username}`}
                    >
                        {collection.author.username}
                    </HorizontalCardTitle>
                    <HorizontalCardContainer className="flex-row items-center">
                        <HorizontalCardDescription>
                            <RelativeTime value={collection.updated} />
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
                <FollowButton
                    iconOnly={!isDesktop}
                    size={!isDesktop ? 'icon-md' : 'md'}
                    user={collection.author}
                />
            </HorizontalCard>

            <Link to={`/collections/${collection.reference}`} className="block">
                <h3>{collection.title}</h3>
            </Link>

            {collection.tags.length > 0 && (
                <div className="flex gap-2">
                    {collection?.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection?.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}
                    {collection.tags.length > 0 && (
                        <Badge variant="secondary">{collection.tags[0]}</Badge>
                    )}
                    {collection.tags.slice(1).map((tag) => (
                        <Badge
                            key={tag}
                            className="hidden md:block"
                            variant="secondary"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {collection.tags.length > 2 && (
                        <Badge variant="outline" className="block md:hidden">
                            +{collection.tags.length - 1}
                        </Badge>
                    )}
                </div>
            )}

            <Stack
                size={(maxPreviewItems + 1) as StackSize}
                gap="md"
                imagePreset="cardSm"
            >
                {previewItems.map((item) => (
                    <EntityCard
                        key={item.content.slug}
                        entity={contentEntity(item.content)}
                        title={getTitle(
                            item.content,
                            preferences.title_language,
                            preferences.name_language,
                        )}
                        titleBlur={collection.spoiler}
                        imageBlur={collection.nsfw || collection.spoiler}
                    />
                ))}
                {remainingCount > 0 && (
                    <PosterCard
                        to={`/collections/${collection.reference}`}
                        image={
                            <div className="isolate flex items-center justify-center">
                                {previewItem.content.image && (
                                    <Image
                                        className="absolute -z-10 size-full blur-lg"
                                        src={previewItem.content.image ?? ''}
                                        alt="Third element"
                                    />
                                )}

                                <span className="font-bold text-2xl text-white drop-shadow-lg">
                                    +{remainingCount}
                                </span>
                            </div>
                        }
                    />
                )}
            </Stack>

            <div className="flex items-center justify-between">
                <StatItemGroup>
                    <StatItem
                        render={
                            <Link
                                to={`/comments/collection/${collection.reference}`}
                            />
                        }
                    >
                        <MessageCircle />
                        {collection.comments_count}
                    </StatItem>
                    <StatItem className="pointer-events-none">
                        <ArrowBigUp className="size-5!" />
                        {collection.vote_score}
                    </StatItem>
                </StatItemGroup>
            </div>
        </Card>
    );
};

export default CollectionCard;
