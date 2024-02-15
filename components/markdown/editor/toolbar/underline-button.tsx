import React from 'react';
import MaterialSymbolsFormatUnderlinedRounded from '~icons/material-symbols/format-underlined-rounded';

import {
    applyFormat$,
    currentFormat$,
    iconComponentFor$,
    useCellValues,
    usePublisher,
} from '@mdxeditor/editor';

import { Button } from '@/components/ui/button';

export const IS_UNDERLINE = 0b1000 as const;

const Component = () => {
    const [currentFormat, iconComponentFor] = useCellValues(
        currentFormat$,
        iconComponentFor$,
    );
    const applyFormat = usePublisher(applyFormat$);

    const underlineIsOn = (currentFormat & IS_UNDERLINE) !== 0;

    return (
        <Button
            variant={underlineIsOn ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => applyFormat('underline')}
        >
            <MaterialSymbolsFormatUnderlinedRounded />
        </Button>
    );
};

export default Component;