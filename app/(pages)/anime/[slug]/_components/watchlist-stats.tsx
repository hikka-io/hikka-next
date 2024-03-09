'use client';

import { createElement } from 'react';
import { NumericFormat } from 'react-number-format';

import { useParams } from 'next/navigation';

import SubHeader from '@/components/sub-header';
import Small from '@/components/typography/small';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import { WATCH_STATUS } from '@/utils/constants';


const Component = () => {
    const params = useParams();
    const { data } = useAnimeInfo({ slug: String(params.slug) });

    if (!data) {
        return null;
    }

    const sumStats =
        data.stats.completed +
        data.stats.on_hold +
        data.stats.dropped +
        data.stats.planned +
        data.stats.watching;

    return (
        <div className="flex flex-col gap-8">
            <SubHeader title="У списках" />
            <div className="relative overflow-hidden rounded-lg border border-secondary/60 bg-secondary/30 p-4">
                <div className="flex flex-col justify-center gap-2">
                    {Object.keys(data.stats)
                        .filter((stat) => !stat.includes('score'))
                        .map((stat) => {
                            const status =
                                WATCH_STATUS[stat as API.WatchStatus];
                            const percentage =
                                (100 * data.stats[stat as API.StatType]) /
                                sumStats;

                            return (
                                <Tooltip key={stat} delayDuration={0}>
                                    <TooltipTrigger>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 w-full flex-1">
                                                <div className="rounded-md bg-secondary p-1">
                                                    {createElement(
                                                        status.icon!,
                                                    )}
                                                </div>
                                                <div className="relative h-2 w-full overflow-hidden rounded-md">
                                                    <div
                                                        className="absolute bottom-0 left-0 h-full w-full opacity-10"
                                                        style={{
                                                            backgroundColor:
                                                            status.color,
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute bottom-0 left-0 flex w-full items-end justify-center p-2"
                                                        style={{
                                                            backgroundColor:
                                                            status.color,
                                                            width: `${percentage}%`,
                                                        }}
                                                    ></div>
                                                </div>

                                            </div>
                                            <Small className="text-muted-foreground w-14 text-right">
                                                <NumericFormat
                                                    thousandSeparator
                                                    displayType="text"
                                                    value={data.stats[stat as API.StatType]}
                                                    decimalScale={1}
                                                />
                                            </Small>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent align="center" side="left">
                                        {percentage.toFixed(2)}%
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Component;
