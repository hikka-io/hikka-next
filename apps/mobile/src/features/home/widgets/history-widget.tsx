import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { type Href, useIsFocused } from 'expo-router';
import { History } from 'lucide-react-native';
import { View } from 'react-native';

import { type HistoryResponse, HistoryTypeEnum } from '@hikka/api';
import {
    contentPath,
    convertHistory,
    formatHistoryTime,
    getTitle,
    groupHistoryByDay,
    type HistoryFact,
    type NameLanguage,
    type TitleLanguage,
} from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Card from '@/components/ui/card';
import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Text, TextClassContext } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import { flattenPages } from '../flatten-pages';
import { HISTORY_PREVIEW_SIZE, homeFollowingHistoryOptions } from '../queries';
import { useHomePreferences } from '../use-home-preferences';
import { useOpenSitePath } from '../use-open-site-path';
import WidgetError from '../widget-error';
import WidgetSection from '../widget-section';

const IMPORT_TITLES: Partial<Record<HistoryTypeEnum, string>> = {
    [HistoryTypeEnum.WATCH_IMPORT]: 'Імпорт аніме',
    [HistoryTypeEnum.READ_IMPORT]: 'Імпорт манґи та ранобе',
};

const HISTORY_REFETCH_INTERVAL_MS = 60_000;

const Fact: FC<{ fact: HistoryFact }> = ({ fact }) => {
    return (
        <>
            {fact.map((part, index) => (
                <Text
                    key={index}
                    className={
                        part.type === 'text'
                            ? undefined
                            : 'font-medium text-foreground'
                    }
                >
                    {part.text}
                </Text>
            ))}
        </>
    );
};

type RowProps = {
    item: HistoryResponse;
    titleLanguage: TitleLanguage;
    nameLanguage: NameLanguage;
};

const HistoryRow: FC<RowProps> = ({ item, titleLanguage, nameLanguage }) => {
    const entry = convertHistory(item);
    const content = item.content;
    const title =
        getTitle(content, titleLanguage, nameLanguage) ||
        IMPORT_TITLES[item.history_type] ||
        'Загальне';

    return (
        <HorizontalCard
            className="px-4 py-3"
            href={
                content
                    ? (contentPath(content.data_type, content.slug) as Href)
                    : undefined
            }
        >
            <HorizontalCardImage
                className="w-12"
                image={content?.image ?? undefined}
            />
            <HorizontalCardContainer className="gap-1">
                <HorizontalCardTitle
                    titleMeta={
                        <Text
                            maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                            className="text-muted-foreground text-xs tabular-nums"
                        >
                            {formatHistoryTime(item.created)}
                        </Text>
                    }
                >
                    {title}
                </HorizontalCardTitle>
                <TextClassContext.Provider value="text-xs text-muted-foreground">
                    <Text
                        numberOfLines={2}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    >
                        {entry.facts.map((fact, index) => (
                            <Text key={index}>
                                {index > 0 && ' · '}
                                <Fact fact={fact} />
                            </Text>
                        ))}
                    </Text>
                </TextClassContext.Provider>
                <View className="flex-row items-center gap-1.5">
                    <Avatar className="size-4 rounded-sm">
                        <AvatarImage src={item.user.avatar} />
                        <AvatarFallback className="rounded-sm" />
                    </Avatar>
                    <Text
                        numberOfLines={1}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="shrink text-muted-foreground text-xs"
                    >
                        {item.user.username}
                    </Text>
                </View>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

const HistoryRowSkeleton: FC = () => {
    return (
        <View className="flex-row items-center gap-4 px-4 py-3">
            <Skeleton className="aspect-[0.7] w-12 rounded-lg" />
            <View className="flex-1 gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </View>
        </View>
    );
};

const HistoryCardSkeleton: FC = () => {
    return (
        <Card className="gap-0 overflow-hidden p-0">
            <View className="flex-row items-baseline gap-1.5 px-4 pt-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
            </View>
            {Array.from({ length: HISTORY_PREVIEW_SIZE }, (_, index) => (
                <View key={index}>
                    {index > 0 && <Separator />}
                    <HistoryRowSkeleton />
                </View>
            ))}
        </Card>
    );
};

export const HistoryWidgetSkeleton: FC = () => {
    return (
        <WidgetSection title="Активність">
            <HistoryCardSkeleton />
        </WidgetSection>
    );
};

type Props = {
    username: string;
};

const HistoryWidget: FC<Props> = ({ username }) => {
    const focused = useIsFocused();
    const openSitePath = useOpenSitePath();
    const { titleLanguage, nameLanguage } = useHomePreferences();
    const { data, isPending, isError, refetch } = useInfiniteQuery({
        ...homeFollowingHistoryOptions(),
        refetchInterval: focused ? HISTORY_REFETCH_INTERVAL_MS : false,
    });
    const list = flattenPages(data);
    const days = list && groupHistoryByDay(list, Date.now());

    return (
        <WidgetSection
            title="Активність"
            onPress={() =>
                openSitePath(`/u/${username}/history?type=following`)
            }
        >
            {isError && <WidgetError onRetry={refetch} />}
            {isPending && <HistoryCardSkeleton />}
            {days && days.length > 0 && (
                <Card className="gap-0 overflow-hidden p-0">
                    {days.map((day, dayIndex) => (
                        <View key={day.key}>
                            {dayIndex > 0 && <Separator />}
                            <View className="flex-row items-baseline gap-1.5 px-4 pt-3">
                                <Text className="font-medium text-xs">
                                    {day.label}
                                </Text>
                                <Text className="text-muted-foreground text-xs">
                                    {day.detail}
                                </Text>
                            </View>
                            {day.items.map((item) => (
                                <HistoryRow
                                    key={item.reference}
                                    item={item}
                                    titleLanguage={titleLanguage}
                                    nameLanguage={nameLanguage}
                                />
                            ))}
                        </View>
                    ))}
                </Card>
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    bordered
                    icon={<Icon as={History} />}
                    title="Історія відсутня"
                    description="Історія оновиться після змін у Вашому списку, або у списку користувачів, яких Ви відстежуєте"
                />
            )}
        </WidgetSection>
    );
};

export default HistoryWidget;
