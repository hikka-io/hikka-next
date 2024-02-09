import React from 'react';
import MaterialSymbolsFormatBoldRounded from '~icons/material-symbols/format-bold-rounded';



import { applyFormat$, currentFormat$, iconComponentFor$, useCellValues, usePublisher } from '@mdxeditor/editor';



import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';


export const IS_BOLD = 0b1 as const;

const Component = () => {
    const [currentFormat, iconComponentFor] = useCellValues(
        currentFormat$,
        iconComponentFor$,
    );
    const applyFormat = usePublisher(applyFormat$);

    const boldIsOn = (currentFormat & IS_BOLD) !== 0;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <Button
                    variant={boldIsOn ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => applyFormat('bold')}
                >
                    <MaterialSymbolsFormatBoldRounded />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Жирний</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default Component;