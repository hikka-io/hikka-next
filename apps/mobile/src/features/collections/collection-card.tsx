import type { FC } from 'react';

import { Link, useRouter } from 'expo-router';
import { ArrowBigUp, MessageCircle } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import type { CollectionResponse, ContentTypeEnum } from '@hikka/api';
import { formatTimeAgo } from '@hikka/core';

import AuthorRow from '@/components/author-row';
import PosterCard from '@/components/content-card/poster-card';
import Card from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { useTitle } from '@/services/session';
import { contentHref } from '@/utils/content-href';
import { presetImageUrl } from '@/utils/image-presets';

import CollectionBadges from './collection-badges';
import { COLLECTION_PREVIEW_SIZE } from './queries';

type Props = {
    collection: CollectionResponse;
};

/** The web's `CollectionCard`: author, title, badges, the first entries (hidden like the web for spoilers and NSFW) and stats. */
const CollectionCard: FC<Props> = ({ collection }) => {
    const router = useRouter();
    const getTitle = useTitle();
    const href = `/collections/${collection.reference}` as const;
    const preview = collection.collection.slice(0, COLLECTION_PREVIEW_SIZE);
    const remaining = collection.entries - COLLECTION_PREVIEW_SIZE;
    const coverItem =
        collection.collection[COLLECTION_PREVIEW_SIZE] ??
        collection.collection[collection.collection.length - 1];

    return (
        <Card className="gap-4">
            <AuthorRow
                username={collection.author.username}
                avatar={collection.author.avatar}
                meta={[formatTimeAgo(collection.updated, Date.now())]}
            />
            <Link href={href} asChild>
                <Pressable
                    accessibilityRole="link"
                    className="gap-3 active:opacity-70"
                >
                    <Text className="font-bold text-lg leading-7">
                        {collection.title}
                    </Text>
                    <CollectionBadges collection={collection} limit={1} />
                </Pressable>
            </Link>
            <View className="flex-row gap-3">
                {preview.map((item) => (
                    <View key={item.content.slug} className="flex-1">
                        <PosterCard
                            href={contentHref(
                                item.content.data_type as ContentTypeEnum,
                                item.content.slug,
                            )}
                            title={getTitle(item.content)}
                            image={item.content.image ?? undefined}
                            titleBlur={collection.spoiler}
                            imageBlur={collection.nsfw || collection.spoiler}
                        />
                    </View>
                ))}
                {Array.from(
                    {
                        length: Math.max(
                            0,
                            COLLECTION_PREVIEW_SIZE - preview.length,
                        ),
                    },
                    (_, index) => (
                        <View key={`empty-${index}`} className="flex-1" />
                    ),
                )}
                <View className="flex-1">
                    {remaining > 0 && coverItem && (
                        <PosterCard
                            href={href}
                            title={`+${remaining}`}
                            titleClassName="opacity-0"
                            image={
                                <View className="size-full items-center justify-center">
                                    {coverItem.content.image && (
                                        <Image
                                            source={presetImageUrl(
                                                coverItem.content.image,
                                                'cardXs',
                                            )}
                                            recyclingKey={
                                                coverItem.content.image
                                            }
                                            blurRadius={24}
                                            contentFit="cover"
                                            className="absolute inset-0 size-full"
                                        />
                                    )}
                                    <Text className="font-bold text-2xl text-white">
                                        +{remaining}
                                    </Text>
                                </View>
                            }
                        />
                    )}
                </View>
            </View>
            <StatItemGroup>
                <StatItem
                    accessibilityLabel={`Коментарі: ${collection.comments_count}`}
                    onPress={() =>
                        router.push(
                            `/comments/collection/${collection.reference}`,
                        )
                    }
                >
                    <Icon as={MessageCircle} />
                    {collection.comments_count}
                </StatItem>
                <StatItem
                    accessibilityLabel={`Рейтинг: ${collection.vote_score}`}
                >
                    <Icon as={ArrowBigUp} className="size-5" />
                    {collection.vote_score}
                </StatItem>
            </StatItemGroup>
        </Card>
    );
};

export default CollectionCard;
