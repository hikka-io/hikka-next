import { type FC, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import {
    getDeclensionWord,
    getWatchTime,
    HOUR_FORMS,
    LIST_STATUS,
    READ_STATUS_ORDER,
    WATCH_STATUS_ORDER,
} from '@hikka/core';

import InlineError from '@/components/inline-error';
import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import SegmentedControl from '@/components/ui/segmented-control';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';

import {
    type ListContentType,
    userReadListStatsOptions,
    userWatchListStatsOptions,
} from './queries';

const TABS = [
    { label: 'Аніме', value: ContentTypeEnum.ANIME },
    { label: 'Манґа', value: ContentTypeEnum.MANGA },
    { label: 'Ранобе', value: ContentTypeEnum.NOVEL },
];

// Uniwind compiles literal class names only, so each status maps to its own string.
const STATUS_BG = {
    completed: 'bg-completed-foreground',
    watching: 'bg-watching-foreground',
    reading: 'bg-reading-foreground',
    planned: 'bg-planned-foreground',
    dropped: 'bg-dropped-foreground',
    on_hold: 'bg-on_hold-foreground',
} as const;

type Status = keyof typeof STATUS_BG;

const statusLabel = (anime: boolean, status: Status) => {
    const labels = (anime ? LIST_STATUS.watch : LIST_STATUS.read) as Record<
        string,
        { title_ua: string }
    >;

    return labels[status].title_ua;
};

type Counts = Partial<Record<Status, number>> & { duration?: number };

const StatsBody: FC<{ anime: boolean; counts: Counts }> = ({
    anime,
    counts,
}) => {
    const order: readonly Status[] = anime
        ? WATCH_STATUS_ORDER
        : READ_STATUS_ORDER;
    const watchTime =
        anime && counts.duration !== undefined
            ? getWatchTime(counts.duration)
            : null;
    const total = order.reduce((sum, status) => sum + (counts[status] ?? 0), 0);

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
                            className={STATUS_BG[status]}
                        />
                    ) : null,
                )}
            </View>
            <View className="flex-row flex-wrap">
                <StatRow label="Всього" count={total} dot="bg-foreground" />
                {order.map((status) => (
                    <StatRow
                        key={status}
                        label={statusLabel(anime, status)}
                        count={counts[status] ?? 0}
                        dot={STATUS_BG[status]}
                    />
                ))}
            </View>
            {anime && watchTime && (
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

const StatRow: FC<{ label: string; count: number; dot: string }> = ({
    label,
    count,
    dot,
}) => (
    <View
        className={`min-h-9 w-1/2 flex-row items-center justify-between gap-2 py-2 pr-3 ${count === 0 ? 'opacity-50' : ''}`}
    >
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
            <View className={`size-2 rounded-full ${dot}`} />
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
    </View>
);

const StatsSkeleton: FC = () => (
    <View className="gap-3">
        <Skeleton className="h-2 w-full rounded-sm" />
        <View className="flex-row flex-wrap">
            {Array.from({ length: 6 }, (_, index) => (
                <View key={index} className="min-h-9 w-1/2 justify-center pr-3">
                    <Skeleton className="h-4 w-full rounded-sm" />
                </View>
            ))}
        </View>
    </View>
);

const AnimeStats: FC<{ username: string }> = ({ username }) => {
    const { data, error, refetch } = useQuery(
        userWatchListStatsOptions(username),
    );

    if (error) return <InlineError onRetry={() => void refetch()} />;

    return data ? <StatsBody anime counts={data} /> : <StatsSkeleton />;
};

const ReadStats: FC<{
    username: string;
    contentType: Exclude<ListContentType, 'anime'>;
}> = ({ username, contentType }) => {
    const { data } = useQuery(userReadListStatsOptions(username, contentType));

    return data ? <StatsBody anime={false} counts={data} /> : <StatsSkeleton />;
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
                    <HeaderTitle>Список</HeaderTitle>
                </Header>
                <SegmentedControl
                    options={TABS}
                    value={tab}
                    onValueChange={setTab}
                />
                {tab === ContentTypeEnum.ANIME ? (
                    <AnimeStats username={username} />
                ) : (
                    <ReadStats
                        key={tab}
                        username={username}
                        contentType={tab}
                    />
                )}
            </Card>
        </View>
    );
};

export default ListStats;
