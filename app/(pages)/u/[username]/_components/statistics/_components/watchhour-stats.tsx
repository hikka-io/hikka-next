'use client';

import formatDuration from 'date-fns/formatDuration';
import intervalToDuration from 'date-fns/intervalToDuration';
import React from 'react';
import MaterialSymbolsClockLoader10 from '~icons/material-symbols/clock-loader-10';



import { useParams } from 'next/navigation';



import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useWatchStats from '@/services/hooks/watch/useWatchStats';


const Component = () => {
    const params = useParams();
    const { data: stats } = useWatchStats(String(params.username));

    return (
        <div className="flex flex-col gap-4 flex-1 bg-secondary/30 border border-secondary/60 p-4 rounded-md">
            <div className="flex gap-2 items-center text-muted-foreground">
                <MaterialSymbolsClockLoader10 />
                <Label>Час аніме</Label>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 justify-between items-end">
                    <H5>
                        {(stats?.duration &&
                            formatDuration(
                                intervalToDuration({
                                    start: 0,
                                    end: stats?.duration * 60 * 1000,
                                }),
                                { format: ['years', 'months', 'days'] },
                            )) ||
                            '0 днів'}
                    </H5>
                    <Small className="text-muted-foreground">
                        {(stats?.duration &&
                            formatDuration(
                                { hours: Math.round(stats?.duration / 60) },
                                { format: ['hours'] },
                            )) ||
                            '0 годин'}
                    </Small>
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
