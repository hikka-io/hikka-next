'use client';

import { CollectionContent, CollectionResponse } from '@hikka/client';
import { formatDistance } from 'date-fns/formatDistance';
import Link from 'next/link';
import { FC } from 'react';

import FollowButton from '@/components/follow-button';
import BxBxsUpvote from '@/components/icons/bx/BxBxsUpvote';
import IconamoonCommentFill from '@/components/icons/iconamoon/IconamoonCommentFill';
import H3 from '@/components/typography/h3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { cn } from '@/utils/utils';

import ContentCard from '../../../components/content-card/content-card';

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
    const previewItems = collection.collection.slice(0, maxPreviewItems);
    const remainingCount = collection.entries - maxPreviewItems;
    const previewItem =
        collection.collection.length > maxPreviewItems
            ? collection.collection[maxPreviewItems]
            : collection.collection[collection.collection.length - 1];

    return (
        <Card className={cn(className)}>
            {/* User Header */}

            <HorizontalCard href={`/u/${collection.author.username}`}>
                <HorizontalCardImage
                    className="w-10"
                    image={collection.author.avatar}
                    imageRatio={1}
                />
                <HorizontalCardContainer className="gap-1">
                    <HorizontalCardTitle>
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
                <FollowButton user={collection.author} />
            </HorizontalCard>

            {/* Collection Title */}
            <Link
                href={`/collections/${collection.reference}`}
                className="block"
            >
                <H3>{collection.title}</H3>
            </Link>

            {/* Preview Items Grid */}
            <Stack size={(maxPreviewItems + 1) as StackSize} gap="md">
                {previewItems.map((item) => (
                    <ContentCard
                        key={item.content.slug}
                        image={item.content.image}
                        title={item.content.title}
                        href={`${CONTENT_TYPE_LINKS[item.content_type]}/${item.content.slug}`}
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
                        href={`/collections/${collection.reference}`}
                        image={
                            <div className="isolate flex items-center justify-center">
                                {previewItem.content.image && (
                                    <Image
                                        className="absolute -z-10 size-full blur-lg"
                                        src={previewItem.content.image ?? ''}
                                        width={100}
                                        height={100}
                                        alt="Third element"
                                    />
                                )}

                                <span className="text-lg font-semibold text-white">
                                    +{remainingCount}
                                </span>
                            </div>
                        }
                    />
                )}
            </Stack>

            {/* Tags and Stats */}
            <div className="flex items-center justify-between">
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
                <div className="flex gap-1">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-muted-foreground"
                    >
                        <Link
                            href={`/comments/collection/${collection.reference}`}
                        >
                            <IconamoonCommentFill className="size-3" />
                            {collection.comments_count}
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="pointer-events-none gap-1 text-muted-foreground"
                    >
                        <BxBxsUpvote className="size-3" />
                        {collection.vote_score}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default CollectionCard;
