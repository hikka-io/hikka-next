import React from 'react';
import MaterialSymbolsFormatBoldRounded from '~icons/material-symbols/format-bold-rounded';

import {
    applyFormat$,
    currentFormat$,
    iconComponentFor$,
    useCellValues,
    usePublisher,
} from '@mdxeditor/editor';

import { Button } from '@/app/_components/ui/button';

export const IS_BOLD = 0b1 as const;

const Component = () => {
    const [currentFormat, iconComponentFor] = useCellValues(
        currentFormat$,
        iconComponentFor$,
    );
    const applyFormat = usePublisher(applyFormat$);

    const boldIsOn = (currentFormat & IS_BOLD) !== 0;

    return (
        <Button
            variant={boldIsOn ? 'secondary' : 'ghost'}
            size="icon-sm"
            onClick={() => applyFormat('bold')}
        >
            <MaterialSymbolsFormatBoldRounded />
        </Button>
    );
};

export default Component;