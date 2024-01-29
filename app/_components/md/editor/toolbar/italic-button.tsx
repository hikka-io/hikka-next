import React from 'react';
import MaterialSymbolsFormatItalicRounded from '~icons/material-symbols/format-italic-rounded';

import {
    applyFormat$,
    currentFormat$,
    iconComponentFor$,
    useCellValues,
    usePublisher,
} from '@mdxeditor/editor';

import { Button } from '@/app/_components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/_components/ui/tooltip';
import MaterialSymbolsFormatBoldRounded from '~icons/*';

export const IS_ITALIC = 0b10 as const;

const Component = () => {
    const [currentFormat, iconComponentFor] = useCellValues(
        currentFormat$,
        iconComponentFor$,
    );
    const applyFormat = usePublisher(applyFormat$);

    const italicIsOn = (currentFormat & IS_ITALIC) !== 0;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <Button
                    variant={italicIsOn ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => applyFormat('italic')}
                >
                    <MaterialSymbolsFormatItalicRounded />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Курсив</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default Component;