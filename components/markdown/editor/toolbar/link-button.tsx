import React from 'react';
import MaterialSymbolsAddLinkRounded from '~icons/material-symbols/add-link-rounded';

import { openLinkEditDialog$, usePublisher } from '@mdxeditor/editor';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import P from '@/components/typography/p';


const Component = () => {
    const openLinkDialog = usePublisher(openLinkEditDialog$);

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <Button
                    variant={'ghost'}
                    size="icon-sm"
                    onClick={() => openLinkDialog()}
                >
                    <MaterialSymbolsAddLinkRounded />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <P>Посилання</P>
            </TooltipContent>
        </Tooltip>
    );
};

export default Component;