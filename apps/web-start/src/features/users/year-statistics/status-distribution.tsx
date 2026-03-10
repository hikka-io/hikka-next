'use client';

import { ContentTypeEnum } from '@hikka/client';
import { FC, useMemo } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import Card from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Header,
    HeaderContainer,
    HeaderDescription,
    HeaderTitle,
} from '@/components/ui/header';

import { YearContentType, YearStatistics } from '@/types/year-statistics';

import { CONTENT_CHART_CONFIG, STATUS_LABELS } from './constants';

interface Props {
    data: YearStatistics;
}

const STATUSES = ['completed', 'planned', 'dropped'] as const;
const CONTENT_TYPES: YearContentType[] = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
];

const YearStatusDistribution: FC<Props> = ({ data }) => {
    const { chartData, chartConfig } = useMemo(() => {
        // Calculate totals for each content type
        const totals = CONTENT_TYPES.reduce(
            (acc, type) => {
                acc[type] = STATUSES.reduce(
                    (sum, status) => sum + data.status[type][status],
                    0,
                );
                return acc;
            },
            {} as Record<YearContentType, number>,
        );

        // Filter content types that have data
        const activeTypes = CONTENT_TYPES.filter((type) => totals[type] > 0);

        // Build chart config only for active types
        const chartConfig = activeTypes.reduce((acc, type) => {
            acc[type] = CONTENT_CHART_CONFIG[type];
            return acc;
        }, {} as ChartConfig);

        // Build chart data
        const chartData = STATUSES.map((status) => {
            const row: Record<string, string | number> = {
                status,
                label: STATUS_LABELS[status],
            };

            activeTypes.forEach((type) => {
                row[type] = data.status[type][status];
            });

            return row;
        }).filter((item) =>
            CONTENT_TYPES.some((type) => (item[type] as number) > 0),
        );

        return { chartData, chartConfig };
    }, [data]);

    if (chartData.length === 0) {
        return (
            <Card>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Розподіл за статусами</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <div className="flex min-h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">Немає даних</p>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Розподіл за статусами</HeaderTitle>
                    <HeaderDescription>
                        Розподіл контенту за статусами
                    </HeaderDescription>
                </HeaderContainer>
            </Header>

            <ChartContainer
                config={chartConfig}
                className="h-80 md:h-full w-full"
            >
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid strokeDasharray="5" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis
                        type="number"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        hide
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="anime" fill="var(--color-anime)" radius={4}>
                        <LabelList
                            dataKey="anime"
                            position="insideBottom"
                            className="fill-foreground"
                            offset={8}
                        />
                    </Bar>
                    <Bar dataKey="manga" fill="var(--color-manga)" radius={4}>
                        <LabelList
                            dataKey="manga"
                            position="insideBottom"
                            className="fill-foreground"
                            offset={8}
                        />
                    </Bar>
                    <Bar dataKey="novel" fill="var(--color-novel)" radius={4}>
                        <LabelList
                            dataKey="novel"
                            position="insideBottom"
                            className="fill-foreground"
                            offset={8}
                        />
                    </Bar>
                </BarChart>
            </ChartContainer>
        </Card>
    );
};

export default YearStatusDistribution;
