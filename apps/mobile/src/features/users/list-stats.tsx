import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Link, useIsFocused } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import { getDeclensionWord, getWatchTime, HOUR_FORMS } from '@hikka/core';

import Card from '@/components/ui/card';
import ErrorState from '@/components/ui/error-state';
import { Header, HeaderTitle } from '@/components/ui/header';
import SegmentedControl from '@/components/ui/segmented-control';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import {
    countsOf,
    STATUS_DOT,
    type StatusCounts,
    statusLabel,
    statusOrder,
    totalCount,
} from './list-status';
import { type ListContentType, userListStatsOptions } from './queries';
import { userListHref } from './user-hrefs';

const TABS = [
    { label: 'Аніме', value: ContentTypeEnum.ANIME },
    { label: 'Манґа', value: ContentTypeEnum.MANGA },
    { label: 'Ранобе', value: ContentTypeEnum.NOVEL },
];

type BodyProps = {
    username: string;
    contentType: ListContentType;
    counts: StatusCounts;
};

const StatsBody: FC<BodyProps> = ({ username, contentType, counts }) => {
    const anime = contentType === ContentTypeEnum.ANIME;
    const order = statusOrder(contentType);
    const watchTime =
        anime && counts.duration !== undefined
            ? getWatchTime(counts.duration)
            : null;
    const total = totalCount(contentType, counts);

    return (
        <View className="gap-3">
            <View
                accessible
                accessibilityLabel={`Всього ${total}`}
                className="h-2 flex-row gap-0.5 overflow-hidden rounded-sm bg-muted"
            >
                {order.map((status) =>
                    counts[status] ? (
                        <View
                            key={status}
                            style={{ flex: counts[status] }}
                            className={STATUS_DOT[status]}
                        />
                    ) : null,
                )}
            </View>
            <View className="-mx-2 flex-row flex-wrap">
                <StatRow
                    label="Всього"
                    count={total}
                    dot="bg-foreground"
                    href={userListHref(username, contentType, 'all')}
                />
                {order.map((status) => (
                    <StatRow
                        key={status}
                        label={statusLabel(contentType, status) ?? status}
                        count={counts[status] ?? 0}
                        dot={STATUS_DOT[status]}
                        href={userListHref(username, contentType, status)}
                    />
                ))}
            </View>
            {watchTime && (
                <View className="flex-row items-center justify-between border-border border-t pt-3">
                    <Text className="text-muted-foreground text-sm">
                        Час перегляду
                    </Text>
                    <Text
                        className="font-medium text-sm"
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        accessibilityHint={`${watchTime.hours} ${getDeclensionWord(watchTime.hours, HOUR_FORMS)}`}
                    >
                        {watchTime.label}
                    </Text>
                </View>
            )}
        </View>
    );
};

type StatRowProps = {
    label: string;
    count: number;
    dot: string;
    href: ReturnType<typeof userListHref>;
};

const StatRow: FC<StatRowProps> = ({ label, count, dot, href }) => (
    <Link href={href} asChild>
        <Pressable
            accessibilityRole="link"
            className={cn(
                'min-h-11 w-1/2 flex-row items-center justify-between gap-2 rounded-sm px-2 active:bg-accent',
                count === 0 && 'opacity-50',
            )}
        >
            <View className="min-w-0 flex-1 flex-row items-center gap-2">
                <View className={cn('size-2 rounded-full', dot)} />
                <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="shrink text-muted-foreground text-sm"
                >
                    {label}
                </Text>
            </View>
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="font-medium text-sm tabular-nums"
            >
                {count}
            </Text>
        </Pressable>
    </Link>
);

const StatsSkeleton: FC = () => (
    <View className="gap-3">
        <Skeleton className="h-2 w-full rounded-sm" />
        <View className="-mx-2 flex-row flex-wrap">
            {Array.from({ length: 6 }, (_, index) => (
                <View
                    key={index}
                    className="min-h-11 w-1/2 justify-center px-2"
                >
                    <Skeleton className="h-4 w-full rounded-sm" />
                </View>
            ))}
        </View>
    </View>
);

type TabProps = {
    username: string;
    contentType: ListContentType;
};

const StatsTab: FC<TabProps> = ({ username, contentType }) => {
    const { data, error, refetch } = useQuery({
        ...userListStatsOptions(username, contentType),
        subscribed: useIsFocused(),
    });

    if (error)
        return <ErrorState variant="inline" onRetry={() => void refetch()} />;

    return data ? (
        <StatsBody
            username={username}
            contentType={contentType}
            counts={countsOf(data)}
        />
    ) : (
        <StatsSkeleton />
    );
};

type Props = {
    username: string;
};

const ListStats: FC<Props> = ({ username }) => {
    const [tab, setTab] = useState<ListContentType>(ContentTypeEnum.ANIME);

    return (
        <View className="px-4 pt-6">
            <Card className="gap-3">
                <Header>
                    <HeaderTitle href={userListHref(username, tab)}>
                        Список
                    </HeaderTitle>
                </Header>
                <SegmentedControl
                    options={TABS}
                    value={tab}
                    onValueChange={setTab}
                />
                <StatsTab key={tab} username={username} contentType={tab} />
            </Card>
        </View>
    );
};

export default ListStats;
