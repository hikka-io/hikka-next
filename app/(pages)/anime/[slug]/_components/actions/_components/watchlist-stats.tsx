'use client';

import { createElement, useRef } from 'react';
import { NumericFormat } from 'react-number-format';

import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import SubHeader from '@/components/sub-header';
import { WATCH_STATUS } from '@/utils/constants';
import useSize from '@/services/hooks/useSize';


const Component = () => {
    const ref = useRef<HTMLDivElement>(null);
    const maxSize = useSize(ref);
    const params = useParams();
    const { data } = useAnimeInfo(String(params.slug));

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
            <SubHeader title="У списках" />
            <div className="relative overflow-hidden rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                <div className="flex flex-col justify-center gap-2">
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
                                    className="flex items-center justify-between gap-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-md bg-secondary p-1">
                                            {createElement(status.icon!)}
                                        </div>
                                        <p className="text-xs text-muted-foreground w-10 text-right">
                                            <NumericFormat
                                                suffix="%"
                                                displayType="text"
                                                value={percentage}
                                                decimalScale={1}
                                            />
                                        </p>
                                    </div>
                                    <div
                                        ref={ref}
                                        className="relative h-2 w-full overflow-hidden rounded-md"
                                    >
                                        <div
                                            className="absolute bottom-0 left-0 h-full w-full opacity-10"
                                            style={{
                                                backgroundColor: status.color,
                                            }}
                                        />
                                        <div
                                            className="absolute bottom-0 left-0 flex w-full items-end justify-center p-2"
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
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Component;