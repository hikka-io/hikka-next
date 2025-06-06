'use client';

import { useUserWatchStats } from '@hikka/react';
import { formatDuration } from 'date-fns/formatDuration';
import { intervalToDuration } from 'date-fns/intervalToDuration';
import { useParams } from 'next/navigation';

import { MaterialSymbolsClockLoader10 } from '@/components/icons/material-symbols/MaterialSymbolsClockLoader10';
import H5 from '@/components/typography/h5';
import Small from '@/components/typography/small';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const WatchhourStats = () => {
    const params = useParams();
    const { data: stats } = useUserWatchStats({
        username: String(params.username),
    });

    return (
        <div className="border-border bg-secondary/20 flex flex-1 flex-col gap-4 rounded-md border p-4">
            <div className="text-muted-foreground flex items-center gap-2">
                <MaterialSymbolsClockLoader10 />
                <Label>Час аніме</Label>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between gap-2">
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

export default WatchhourStats;
