'use client';

import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import React from 'react';

import { useParams } from 'next/navigation';

import { useWatchStats } from '@/app/(pages)/u/[username]/page.hooks';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import MaterialSymbolsClockLoader10 from '~icons/material-symbols/clock-loader-10'


const Component = () => {
    const params = useParams();
    const { data: stats } = useWatchStats(String(params.username));

    console.log(
        stats?.duration &&
            intervalToDuration({
                start: 0,
                end: stats?.duration * 60 * 1000,
            }),
    );

    return (
        <div className="flex flex-col gap-4 flex-1 bg-secondary/30 border border-secondary/60 p-4 rounded-md">
            <div className="flex gap-2 items-center text-muted-foreground">
                <MaterialSymbolsClockLoader10 />
                <Label>Час аніме</Label>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-between items-end">
                    <h5>
                        {(stats?.duration &&
                                formatDuration(
                                    intervalToDuration({
                                        start: 0,
                                        end: stats?.duration * 60 * 1000,
                                    }),
                                    { format: ['years', 'months', 'days'] },
                                )) ||
                            '0 днів'}
                    </h5>
                    <p className="text-muted-foreground text-xs">
                        {(stats?.duration &&
                                formatDuration(
                                    { hours: Math.round(stats?.duration / 60) },
                                    { format: ['hours'] },
                                )) ||
                            '0 годин'}
                    </p>
                </div>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                        <Progress
                            className="h-2"
                            value={stats?.duration}
                            max={525600}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        {(stats?.duration &&
                                formatDuration(
                                    intervalToDuration({
                                        start: 0,
                                        end: stats?.duration * 60 * 1000,
                                    }),
                                )) ||
                            '0 днів'}{' '}
                        <span className="text-muted-foreground">/ 1 рік</span>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

export default Component;
