import { type FC, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { ArrowBigUp, Layers, MessageCircle } from 'lucide-react-native';
import { View } from 'react-native';

import type { CollectionResponse } from '@hikka/api';
import type { CommunityTab } from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { StatItem, StatItemGroup } from '@/components/ui/stat-item';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import { flattenPages } from '../flatten-pages';
import { COLLECTIONS_PREVIEW_SIZE, homeCollectionsOptions } from '../queries';
import { useOpenSitePath } from '../use-open-site-path';
import WidgetSection from '../widget-section';

const CollectionRow: FC<{ collection: CollectionResponse }> = ({
    collection,
}) => {
    const openSitePath = useOpenSitePath();

    return (
        <HorizontalCard
            className="px-4 py-3"
            onPress={() => openSitePath(`/collections/${collection.reference}`)}
        >
            <HorizontalCardImage
                className="w-14"
                image={collection.collection[0]?.content.image ?? undefined}
                imageBlur={collection.nsfw || collection.spoiler}
            >
                <View className="absolute bottom-1 left-1 flex-row items-center gap-1 rounded-md bg-black/65 px-1.5 py-0.5">
                    <Icon as={Layers} className="size-3 text-white" />
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="font-medium text-white text-xs"
                    >
                        {collection.entries}
                    </Text>
                </View>
            </HorizontalCardImage>
            <HorizontalCardContainer className="gap-1">
                <View className="flex-row items-center gap-2">
                    <Avatar className="size-5 rounded-sm">
                        <AvatarImage src={collection.author.avatar} size={20} />
                        <AvatarFallback className="rounded-sm" />
                    </Avatar>
                    <Text
                        numberOfLines={1}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="shrink text-muted-foreground text-xs"
                    >
                        {collection.author.username}
                    </Text>
                </View>
                <HorizontalCardTitle>{collection.title}</HorizontalCardTitle>
                <View className="flex-row flex-wrap items-center gap-2">
                    <StatItemGroup size="sm" className="flex-1">
                        <StatItem size="sm">
                            <Icon as={MessageCircle} />
                            {collection.comments_count}
                        </StatItem>
                        <StatItem size="sm">
                            <Icon as={ArrowBigUp} className="size-4" />
                            {collection.vote_score}
                        </StatItem>
                    </StatItemGroup>
                    {collection.spoiler && (
                        <Badge variant="warning">Спойлери</Badge>
                    )}
                    {collection.nsfw && (
                        <Badge variant="destructive">+18</Badge>
                    )}
                </View>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

const CollectionSkeleton: FC = () => {
    return (
        <View className="flex-row items-center gap-4 px-4 py-3">
            <Skeleton className="aspect-[0.7] w-14 rounded-lg" />
            <View className="flex-1 gap-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
            </View>
        </View>
    );
};

type Props = {
    username?: string;
};

const CollectionsWidget: FC<Props> = ({ username }) => {
    const openSitePath = useOpenSitePath();
    const [tab, setTab] = useState<CommunityTab>('newest');
    const own = !!username && tab === 'own';
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeCollectionsOptions(tab, username),
    );
    const list = flattenPages(data);

    const tabs = [
        { value: 'newest' as const, label: 'Нові' },
        { value: 'popular' as const, label: 'Популярні' },
        ...(username ? [{ value: 'own' as const, label: 'Мої' }] : []),
    ];

    return (
        <WidgetSection
            title="Колекції"
            onPress={() => openSitePath('/collections')}
        >
            <SegmentedControl
                options={tabs}
                value={tab}
                onValueChange={setTab}
            />
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {(isPending || (list && list.length > 0)) && (
                <Card className="gap-0 overflow-hidden p-0">
                    {isPending &&
                        Array.from(
                            { length: COLLECTIONS_PREVIEW_SIZE },
                            (_, index) => (
                                <View key={index}>
                                    {index > 0 && <Separator />}
                                    <CollectionSkeleton />
                                </View>
                            ),
                        )}
                    {list?.map((collection, index) => (
                        <View key={collection.reference}>
                            {index > 0 && <Separator />}
                            <CollectionRow collection={collection} />
                        </View>
                    ))}
                </Card>
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    bordered
                    icon={<Icon as={Layers} />}
                    title={own ? 'У вас ще немає колекцій' : 'Немає колекцій'}
                />
            )}
        </WidgetSection>
    );
};

export default CollectionsWidget;
