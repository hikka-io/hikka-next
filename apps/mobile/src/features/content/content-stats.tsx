import { type FC, useState } from 'react';

import { View } from 'react-native';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';
import {
    contentScoreStats,
    contentStatusStats,
    formatNumber,
    LIST_STATUS,
    type ContentStats as Stats,
} from '@hikka/core';

import { STATUS_DOT } from '@/components/tracking';
import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import { Header, HeaderTitle } from '@/components/ui/header';
import SegmentedBar from '@/components/ui/segmented-bar';
import SegmentedControl from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';

import type { ContentInfo } from './queries';

type StatsTab = 'list' | 'score';

const percent = (value: number) => `${value.toFixed(1)}%`;

type BodyProps = {
    stats: Stats;
};

const StatusStats: FC<BodyProps & { contentType: MainContentTypeEnum }> = ({
    stats,
    contentType,
}) => {
    const entries = contentStatusStats(stats, contentType);
    const labels = (
        contentType === ContentTypeEnum.ANIME
            ? LIST_STATUS.watch
            : LIST_STATUS.read
    ) as Record<string, { title_ua: string } | undefined>;

    return (
        <View className="gap-3">
            <SegmentedBar
                segments={entries.map((entry) => ({
                    key: entry.key,
                    count: entry.count,
                    className: STATUS_DOT[entry.key],
                }))}
            />
            <View className="gap-3">
                {entries.map((entry) => {
                    const label = labels[entry.key]?.title_ua ?? entry.key;

                    return (
                        <View
                            key={entry.key}
                            accessible
                            accessibilityLabel={`${label}: ${formatNumber(entry.count)}, ${percent(entry.percentage)}`}
                            className={cn(
                                'flex-row items-center gap-2',
                                entry.count === 0 && 'opacity-50',
                            )}
                        >
                            <View className="min-w-0 flex-1 flex-row items-center gap-2">
                                <View
                                    className={cn(
                                        'size-2 rounded-full',
                                        STATUS_DOT[entry.key],
                                    )}
                                />
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
                                {formatNumber(entry.count)}
                            </Text>
                            <Text
                                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                                className="w-14 text-right text-muted-foreground text-xs tabular-nums"
                            >
                                {percent(entry.percentage)}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const ScoreStats: FC<BodyProps> = ({ stats }) => (
    <View className="gap-2">
        {contentScoreStats(stats).map((entry) => (
            <View
                key={entry.key}
                accessible
                accessibilityLabel={`Оцінка ${entry.key}: ${formatNumber(entry.count)}, ${percent(entry.percentage)}`}
                className="flex-row items-center gap-2"
            >
                <View className="size-6 items-center justify-center rounded-md bg-secondary/20">
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="font-medium text-xs tabular-nums"
                    >
                        {entry.key}
                    </Text>
                </View>
                <View className="h-2 flex-1 overflow-hidden rounded-md bg-secondary/60">
                    <View
                        style={{ width: `${entry.percentage}%` }}
                        className="h-full bg-primary-foreground"
                    />
                </View>
                <Text
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="w-14 text-right text-muted-foreground text-xs tabular-nums"
                >
                    {formatNumber(entry.count)}
                </Text>
            </View>
        ))}
    </View>
);

type Props = {
    content: ContentInfo;
};

/** The web's `ContentStats`: how many users hold the title in each list status, and the score histogram (MAL data). */
const ContentStats: FC<Props> = ({ content }) => {
    const [tab, setTab] = useState<StatsTab>('list');
    const hasList = contentStatusStats(content.stats, content.data_type).some(
        (entry) => entry.count > 0,
    );
    const hasScores = contentScoreStats(content.stats).length > 0;
    const tabs = [
        { value: 'list' as const, label: 'У списках', shown: hasList },
        { value: 'score' as const, label: 'Оцінки', shown: hasScores },
    ].filter((option) => option.shown);
    const active = tabs.find((option) => option.value === tab) ?? tabs[0];

    if (!active) return null;

    return (
        <Card>
            <Header>
                <HeaderTitle>Статистика</HeaderTitle>
                <Badge variant="secondary">MAL</Badge>
            </Header>
            {tabs.length > 1 && (
                <SegmentedControl
                    options={tabs}
                    value={active.value}
                    onValueChange={setTab}
                />
            )}
            {active.value === 'list' ? (
                <StatusStats
                    stats={content.stats}
                    contentType={content.data_type}
                />
            ) : (
                <ScoreStats stats={content.stats} />
            )}
        </Card>
    );
};

export default ContentStats;
