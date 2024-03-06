import format from 'date-fns/format';
import toDate from 'date-fns/toDate';
import React from 'react';

import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import getDeclensionWord from '@/utils/getDeclensionWord';
import P from '@/components/typography/p';

interface Props {
    item: API.Activity;
    max: number;
}

const ACTION_DECLENSION: [string, string, string] = ['дія', 'дії', 'дій'];

const Component = ({ item, max }: Props) => {
    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <div className="relative h-full flex items-end">
                    <div
                        style={{
                            height: `${(100 * item.actions) / max}%`,
                        }}
                        className="w-2 rounded-full bg-primary"
                    />
                    <div className="absolute w-2 rounded-full bg-secondary/30 h-full -z-10" />
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

export default Component;
