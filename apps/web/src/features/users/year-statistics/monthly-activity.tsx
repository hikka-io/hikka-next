'use client';

import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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

import {
    MONTHS,
    MONTH_LABELS,
    MONTH_LABELS_FULL,
    YearStatistics,
} from '@/types/year-statistics';

interface Props {
    data: YearStatistics;
}

const chartConfig = {
    minutes: {
        label: 'Хвилин',
        color: 'hsl(321 70% 69%)',
    },
} satisfies ChartConfig;

const YearMonthlyActivity: FC<Props> = ({ data }) => {
    const chartData = MONTHS.map((month: (typeof MONTHS)[number]) => ({
        monthKey: month,
        month: MONTH_LABELS[month],
        monthFull: MONTH_LABELS_FULL[month],
        minutes: data.duration_month[month],
        hours: Math.round((data.duration_month[month] / 60) * 10) / 10,
    }));

    return (
        <Card className="gap-8">
            <Header>
                <HeaderContainer className="gap-1 flex-col items-start">
                    <HeaderTitle>Активність за місяцями</HeaderTitle>
                    <HeaderDescription>
                        Скільки часу Ви витрачали на перегляд контенту за
                        місяцями
                    </HeaderDescription>
                </HeaderContainer>
            </Header>

            <ChartContainer
                config={chartConfig}
                className="h-80 md:h-full w-full"
            >
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient
                            id="fillMinutes"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="hsl(321 70% 69%)"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="hsl(321 70% 69%)"
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        tickCount={4}
                        tickSize={0}
                        padding={{ left: 16, right: 16 }}
                        tickMargin={8}
                    />
                    <YAxis
                        tickCount={3}
                        tickLine={false}
                        axisLine={false}
                        padding={{ bottom: 16, top: 16 }}
                        tickFormatter={(value) =>
                            value >= 60
                                ? `${Math.round(value / 60)} год`
                                : `${value} хв`
                        }
                    />
                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                labelFormatter={(_, payload) => {
                                    const item = payload[0]?.payload as {
                                        monthFull: string;
                                    };
                                    return item?.monthFull;
                                }}
                                formatter={(value, name, item) => (
                                    <div className="flex flex-col gap-2">
                                        <span className="text-muted-foreground">
                                            {
                                                (
                                                    item.payload as {
                                                        hours: number;
                                                    }
                                                )?.hours
                                            }{' '}
                                            годин
                                        </span>
                                    </div>
                                )}
                            />
                        }
                    />
                    <Area
                        dataKey="minutes"
                        type="monotone"
                        fill="url(#fillMinutes)"
                        stroke="hsl(321 70% 69%)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ChartContainer>
        </Card>
    );
};

export default YearMonthlyActivity;
