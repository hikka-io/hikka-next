'use client';

import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { CalendarRange, Flame, Tally5 } from 'lucide-react';
import { FC, useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import Card from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderTitle,
} from '@/components/ui/header';

import { YearBinge, YearStatistics } from '@/types/year-statistics';
import { getDeclensionWord } from '@/utils/i18n';

import StatCard from './components/stat-card';

interface Props {
    data: YearStatistics;
}

const TOP_BINGES_LIMIT = 5;

const chartConfig = {
    count: {
        label: 'Днів',
        color: 'hsl(321 70% 69%)',
    },
} satisfies ChartConfig;

const RANK_COLORS = {
    1: 'hsl(38 92% 50%)', // Gold
    2: 'hsl(215 14% 64%)', // Silver
    3: 'hsl(25 75% 47%)', // Bronze
    default: 'hsl(321 70% 69%)', // Primary pink
} as const;

const getRankColor = (rank: number): string => {
    return RANK_COLORS[rank as keyof typeof RANK_COLORS] ?? RANK_COLORS.default;
};

const formatDateRange = (
    startTimestamp: number,
    endTimestamp: number,
): string => {
    const startDate = new Date(startTimestamp * 1000);
    const endDate = new Date(endTimestamp * 1000);

    return `${format(startDate, 'd MMM', { locale: uk })} - ${format(endDate, 'd MMM', { locale: uk })}`;
};

const YearBingeHighlights: FC<Props> = ({ data }) => {
    const { topBinges, maxCount, totalActiveDays, chartData } = useMemo(() => {
        if (data.binges.length === 0) {
            return {
                topBinges: [],
                maxCount: 0,
                totalActiveDays: 0,
                chartData: [],
            };
        }

        const sorted = [...data.binges]
            .sort((a, b) => b.count - a.count)
            .slice(0, TOP_BINGES_LIMIT);

        const maxCount = sorted[0]?.count ?? 1;
        const totalActiveDays = data.binges.reduce(
            (acc: number, binge: YearBinge) => acc + binge.count,
            0,
        );

        const chartData = sorted.map((binge, index) => ({
            rank: index + 1,
            label: formatDateRange(binge.start_date, binge.end_date),
            count: binge.count,
            startDate: binge.start_date,
            endDate: binge.end_date,
        }));

        return { topBinges: sorted, maxCount, totalActiveDays, chartData };
    }, [data.binges]);

    if (topBinges.length === 0) {
        return null;
    }

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Марафон активності</HeaderTitle>
                    <HeaderDescription>
                        Найдовші серії активності протягом року
                    </HeaderDescription>
                </HeaderContainer>
            </Header>

            <div className="flex flex-col gap-6">
                <SummaryStats
                    totalPeriods={data.binges.length}
                    longestStreak={maxCount}
                    totalActiveDays={totalActiveDays}
                />

                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <BarChart data={chartData} layout="vertical">
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                `${value} ${getDeclensionWord(Number(value), [
                                    'день',
                                    'дні',
                                    'днів',
                                ])}`
                            }
                            padding={{ right: 16 }}
                            tickMargin={8}
                        />
                        <YAxis
                            type="category"
                            dataKey="label"
                            tickLine={false}
                            axisLine={false}
                            hide
                        />
                        <CartesianGrid strokeDasharray="5" horizontal={false} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, _, item) => (
                                        <div className="flex items-center gap-2">
                                            <Flame className="size-4 text-destructive-foreground" />
                                            <span className="font-medium">
                                                {value}{' '}
                                                {getDeclensionWord(
                                                    Number(value),
                                                    ['день', 'дні', 'днів'],
                                                )}{' '}
                                                поспіль
                                            </span>
                                        </div>
                                    )}
                                />
                            }
                        />
                        <Bar dataKey="count" radius={4} maxBarSize={40}>
                            {chartData.map((entry) => (
                                <Cell
                                    key={`cell-${entry.rank}`}
                                    fill={getRankColor(entry.rank)}
                                />
                            ))}
                            <LabelList
                                dataKey="label"
                                position="insideLeft"
                                offset={8}
                                className="fill-white"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </Card>
    );
};

interface SummaryStatsProps {
    totalPeriods: number;
    longestStreak: number;
    totalActiveDays: number;
}

const SummaryStats: FC<SummaryStatsProps> = ({
    totalPeriods,
    longestStreak,
    totalActiveDays,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
            className="w-full"
            icon={<Flame className="size-4 text-destructive-foreground" />}
            value={longestStreak}
            label="Найдовша серія"
        />
        <StatCard
            className="w-full"
            icon={<Tally5 className="size-4 text-success-foreground" />}
            value={totalActiveDays}
            label="Днів активності"
        />
        <StatCard
            className="w-full"
            icon={<CalendarRange className="size-4 text-warning-foreground" />}
            value={totalPeriods}
            label="Періодів активності"
        />
    </div>
);

export default YearBingeHighlights;
