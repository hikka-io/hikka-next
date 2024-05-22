import format from 'date-fns/format';
import toDate from 'date-fns/toDate';
import React, { FC } from 'react';

import P from '@/components/typography/p';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import getDeclensionWord from '@/utils/getDeclensionWord';

interface Props {
    item: API.Activity;
    max: number;
}

const ACTION_DECLENSION: [string, string, string] = ['дія', 'дії', 'дій'];

const ActivityItem: FC<Props> = ({ item, max }) => {
    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <div className="relative flex h-full items-end">
                    <div
                        style={{
                            height: `${(100 * item.actions) / max}%`,
                        }}
                        className="w-2 rounded-full bg-primary"
                    />
                    <div className="absolute -z-10 h-full w-2 rounded-full bg-secondary/30" />
                </div>
            </TooltipTrigger>
            {item.timestamp !== 0 && (
                <TooltipContent>
                    <Label>
                        {item.actions}{' '}
                        {getDeclensionWord(item.actions, ACTION_DECLENSION)}
                    </Label>
                    <P className="text-muted-foreground">
                        {format(toDate(item.timestamp * 1000), 'd.MM.yyyy')}
                    </P>
                </TooltipContent>
            )}
        </Tooltip>
    );
};

export default ActivityItem;
