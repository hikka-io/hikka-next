'use client';

import { FC } from 'react';
import { NumericFormat } from 'react-number-format';

import Small from '@/components/typography/small';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/utils/utils';

interface Props {
    stats: Hikka.ListStat[];
}

const Stats: FC<Props> = ({ stats }) => {
    return (
        <div className="relative rounded-lg border border-border bg-secondary/20 p-4 backdrop-blur-sm">
            <div className="flex flex-col justify-center gap-2">
                {stats.map((stat) => {
                    return (
                        <Tooltip
                            key={`${stat.value}-${stat.percentage}`}
                            delayDuration={0}
                        >
                            <TooltipTrigger asChild>
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex w-full flex-1 items-center gap-2">
                                        {stat.icon && (
                                            <div className="flex size-6 items-center justify-center rounded-md bg-secondary/20">
                                                {stat.icon}
                                            </div>
                                        )}
                                        <div className="relative h-2 w-full flex-1 overflow-hidden rounded-md">
                                            <div
                                                className={cn(
                                                    'absolute bottom-0 left-0 size-full bg-primary-foreground/10',
                                                    !!stat.name &&
                                                        `bg-${stat.name}`,
                                                )}
                                            />
                                            <div
                                                style={{
                                                    width: `${stat.percentage}%`,
                                                }}
                                                className={cn(
                                                    'absolute bottom-0 left-0 flex h-2 w-full items-end justify-center bg-primary-foreground',
                                                    !!stat.name &&
                                                        `bg-${stat.name}-foreground`,
                                                )}
                                            ></div>
                                        </div>
                                    </div>
                                    <Small className="w-14 text-right text-muted-foreground">
                                        <NumericFormat
                                            thousandSeparator
                                            displayType="text"
                                            value={stat.value}
                                            decimalScale={1}
                                        />
                                    </Small>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent align="center" side="left">
                                {stat.percentage.toFixed(2)}%
                            </TooltipContent>
                        </Tooltip>
                    );
                })}
            </div>
        </div>
    );
};

export default Stats;
