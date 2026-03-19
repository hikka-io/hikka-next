'use client';

import { CollectionContent, CollectionResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import { ArrowBigUp, MessageCircle } from 'lucide-react';
import { FC } from 'react';

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
import Stack, { StackSize } from '@/components/ui/stack';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';

import FollowButton from '@/features/common/follow-button';

import { useMediaQuery } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { Link } from '@/utils/navigation';

interface Props {
    collection: CollectionResponse<CollectionContent>;
    className?: string;
    maxPreviewItems: number;
}

const CollectionCard: FC<Props> = ({
    collection,
    className,
    maxPreviewItems = 6,
}) => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
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
            {/* User Header */}

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
                    iconOnly={!isDesktop}
                    size={!isDesktop ? 'icon-md' : 'md'}
                    user={collection.author}
                />
            </HorizontalCard>

            {/* Collection Title */}
            <Link to={`/collections/${collection.reference}`} className="block">
                <h3>{collection.title}</h3>
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

            {/* Preview Items Grid */}
            <Stack
                size={(maxPreviewItems + 1) as StackSize}
                gap="md"
                imagePreset="cardSm"
            >
                {previewItems.map((item) => (
                    <ContentCard
                        key={item.content.slug}
                        image={item.content.image}
                        title={item.content.title}
                        to={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.content.slug}`}
                        className={cn(collection.spoiler && 'spoiler-blur-md')}
                        titleClassName={cn(
                            collection.spoiler && 'spoiler-blur-sm',
                        )}
                        containerClassName={cn(
                            collection.nsfw && 'spoiler-blur-md',
                        )}
                        watch={
                            'watch' in item.content &&
                            item.content.watch.length > 0
                                ? item.content.watch[0]
                                : undefined
                        }
                        read={
                            'read' in item.content &&
                            item.content.read.length > 0
                                ? item.content.read[0]
                                : undefined
                        }
                        slug={item.content.slug}
                        content_type={item.content_type}
                    />
                ))}
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

                                <span className="text-2xl font-bold text-white drop-shadow-lg">
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
