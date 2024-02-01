import React from 'react';
import MaterialSymbolsAddLinkRounded from '~icons/material-symbols/add-link-rounded';

import { openLinkEditDialog$, usePublisher } from '@mdxeditor/editor';

import { Button } from '@/app/_components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/app/_components/ui/tooltip';


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
                <p>Посилання</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default Component;