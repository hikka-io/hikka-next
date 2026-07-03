import type { ComponentProps, FC } from 'react';

import { formatDistance } from 'date-fns/formatDistance';
import { ArrowBigUp, MessageCircle } from 'lucide-react';

import type { CollectionResponse } from '@hikka/api';

import FollowButton from '@/components/action-buttons/follow-button';
import ContentCard from '@/components/content-card/content-card';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/ui/horizontal-card';
import Image from '@/components/ui/image';
import { Label } from '@/components/ui/label';
import Stack, { type StackSize } from '@/components/ui/stack';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { useMediaQuery } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';
import { getTitle } from '@/utils/title/get-title';

type Props = {
    collection: CollectionResponse;
    className?: string;
    maxPreviewItems: number;
    /**
     * `default` — full-width card used on the collections catalog.
     * `compact` — denser card used in the home sidebar widget.
     */
    variant?: 'default' | 'compact';
};

const CollectionCard: FC<Props> = ({
    collection,
    className,
    maxPreviewItems = 6,
    variant = 'default',
}) => {
    const isCompact = variant === 'compact';
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const { preferences } = useSessionUI();
    const previewItems = collection.collection.slice(0, maxPreviewItems);
    const remainingCount = collection.entries - maxPreviewItems;
    const previewItem =
        collection.collection.length > maxPreviewItems
            ? collection.collection[maxPreviewItems]
            : collection.collection[collection.collection.length - 1];

    return (
        <Card
            variant="solid"
            className={cn(
                !isCompact &&
                    'isolate -mx-4 overflow-hidden rounded-none border-x-0 md:mx-0 md:rounded-lg md:border-x',
                className,
            )}
        >
            {/* User Header */}

            <HorizontalCard>
                <HorizontalCardImage
                    className={isCompact ? 'w-10' : 'w-12'}
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
                            {formatDistance(
                                collection.updated * 1000,
                                Date.now(),
                                {
                                    addSuffix: true,
                                },
                            )}
                        </HorizontalCardDescription>
                    </HorizontalCardContainer>
                </HorizontalCardContainer>
                <FollowButton
                    iconOnly={isCompact || !isDesktop}
                    size={isCompact || !isDesktop ? 'icon-md' : 'md'}
                    user={collection.author}
                />
            </HorizontalCard>

            {/* Collection Title */}
            <Link to={`/collections/${collection.reference}`} className="block">
                {isCompact ? (
                    <Label>{collection.title}</Label>
                ) : (
                    <h3>{collection.title}</h3>
                )}
            </Link>

            {/* Tags */}
            {collection.tags.length > 0 && (
                <div className="flex gap-2">
                    {collection!.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection!.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}
                    {collection.tags.length > 0 && (
                        <Badge variant="secondary">{collection.tags[0]}</Badge>
                    )}
                    {(isCompact
                        ? collection.tags.slice(1, 2)
                        : collection.tags.slice(1)
                    ).map((tag) => (
                        <Badge
                            key={tag}
                            className={cn(!isCompact && 'hidden md:block')}
                            variant="secondary"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {collection.tags.length > 2 && (
                        <Badge
                            variant="outline"
                            className={cn(!isCompact && 'block md:hidden')}
                        >
                            +{collection.tags.length - 1}
                        </Badge>
                    )}
                </div>
            )}

            {/* Preview Items Grid */}
            <Stack
                size={(maxPreviewItems + 1) as StackSize}
                gap={isCompact ? 'sm' : 'md'}
                className={cn(isCompact && 'grid-min-5')}
                imagePreset="cardSm"
            >
                {previewItems.map((item) => {
                    const contentType = item.content_type as NonNullable<
                        ComponentProps<typeof ContentCard>['content_type']
                    >;
                    return (
                        <ContentCard
                            key={item.content.slug}
                            image={item.content.image}
                            title={
                                isCompact
                                    ? undefined
                                    : getTitle(
                                          item.content,
                                          preferences.title_language,
                                          preferences.name_language,
                                      )
                            }
                            to={`${CONTENT_TYPE_LINKS[contentType]}/${item.content.slug}`}
                            titleBlur={collection.spoiler}
                            imageBlur={collection.nsfw || collection.spoiler}
                            watch={
                                'watch' in item.content &&
                                item.content.watch.length > 0
                                    ? (item.content.watch[0] as ComponentProps<
                                          typeof ContentCard
                                      >['watch'])
                                    : undefined
                            }
                            read={
                                'read' in item.content &&
                                item.content.read.length > 0
                                    ? (item.content.read[0] as ComponentProps<
                                          typeof ContentCard
                                      >['read'])
                                    : undefined
                            }
                            slug={item.content.slug}
                            content_type={contentType}
                        />
                    );
                })}
                {remainingCount > 0 && (
                    <ContentCard
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

            {/* Stats */}
            <div className="flex items-center justify-between">
                <StatItemGroup>
                    <StatItem asChild>
                        <Link
                            to={`/comments/collection/${collection.reference}`}
                        >
                            <MessageCircle />
                            {collection.comments_count}
                        </Link>
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
