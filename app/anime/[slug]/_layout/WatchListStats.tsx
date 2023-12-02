'use client';

import { WATCH_STATUS } from '@/utils/constants';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import SubHeader from '@/app/_components/SubHeader';
import { createElement, useRef } from 'react';
import { NumericFormat } from 'react-number-format';
import useSize from "@/utils/hooks/useSize";

const DATA = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

const Component = () => {
    const ref = useRef<HTMLDivElement>(null);
    const maxSize = useSize(ref);
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });

    const maxWidth = maxSize?.width || 120;

    if (!data) {
        return null;
    }

    const sumStats =
        data.stats.completed +
        data.stats.on_hold +
        data.stats.dropped +
        data.stats.planned +
        data.stats.watching;

    const max = Math.max(
        ...Object.keys(data.stats)
            .filter((stat) => !stat.includes('score'))
            .map((s) => data.stats[s as Hikka.StatType]),
    );

    const maxPercentage = (100 * max) / sumStats;

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="У Списках" />
            <div className="relative overflow-hidden p-4 border border-secondary/60 rounded-lg bg-secondary/30">
                <div className="flex flex-col gap-2 justify-center">
                    {Object.keys(data.stats)
                        .filter((stat) => !stat.includes('score'))
                        .map((stat) => {
                            const status =
                                WATCH_STATUS[stat as Hikka.WatchStatus];
                            const percentage =
                                (100 * data.stats[stat as Hikka.StatType]) /
                                sumStats;

                            return (
                                <div
                                    key={stat}
                                    className="flex gap-2 justify-between items-center"
                                >
                                    <div
                                        ref={ref}
                                        className="relative overflow-hidden rounded-md w-full h-2"
                                    >
                                        <div
                                            className="absolute bottom-0 left-0 w-full h-full opacity-10"
                                            style={{
                                                backgroundColor: status.color,
                                            }}
                                        />
                                        <div
                                            className="absolute bottom-0 w-full p-2 left-0 flex items-end justify-center"
                                            style={{
                                                backgroundColor: status.color,
                                                width: `${
                                                    (percentage / 100) *
                                                        maxWidth +
                                                    ((100 - maxPercentage) /
                                                        100) *
                                                        maxWidth
                                                }px`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <p className="label-text-alt w-10 text-right">
                                            <NumericFormat
                                                suffix="%"
                                                displayType="text"
                                                value={percentage}
                                                decimalScale={1}
                                            />
                                        </p>
                                        <div className="p-1 bg-secondary rounded-md">
                                            {createElement(status.icon)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Component;
