'use client';

import { format } from 'date-fns';
import { FC } from 'react';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/cn';

interface Props {
    date: Date;
    actions: number;
    level: 0 | 1 | 2 | 3 | 4;
}

const LEVEL_CLASSES: Record<number, string> = {
    0: 'bg-secondary',
    1: 'bg-primary-foreground/20',
    2: 'bg-primary-foreground/40',
    3: 'bg-primary-foreground/70',
    4: 'bg-primary-foreground',
};

const HeatmapCell: FC<Props> = ({ date, actions, level }) => {
    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <div
                    className={cn('size-2.5 rounded-xs', LEVEL_CLASSES[level])}
                />
            </TooltipTrigger>
            <TooltipContent>
                <span>{format(date, 'd MMM yyyy')}</span>
                {' — '}
                <span className="text-muted-foreground">
                    {actions}{' '}
                    {actions === 1
                        ? 'дія'
                        : actions >= 2 && actions <= 4
                          ? 'дії'
                          : 'дій'}
                </span>
            </TooltipContent>
        </Tooltip>
    );
};

export default HeatmapCell;
