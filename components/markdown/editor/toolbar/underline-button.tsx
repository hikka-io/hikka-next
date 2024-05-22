import {
    applyFormat$,
    currentFormat$,
    iconComponentFor$,
    useCellValues,
    usePublisher,
} from '@mdxeditor/editor';
import React from 'react';
import MaterialSymbolsFormatUnderlinedRounded from '~icons/material-symbols/format-underlined-rounded';

import { Button } from '@/components/ui/button';

export const IS_UNDERLINE = 0b1000 as const;

const UnderlineButton = () => {
    const [currentFormat, iconComponentFor] = useCellValues(
        currentFormat$,
        iconComponentFor$,
    );
    const applyFormat = usePublisher(applyFormat$);

    const underlineIsOn = (currentFormat & IS_UNDERLINE) !== 0;

    return (
        <Button
            type="button"
            variant={underlineIsOn ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => applyFormat('underline')}
        >
            <MaterialSymbolsFormatUnderlinedRounded />
        </Button>
    );
};

export default UnderlineButton;
