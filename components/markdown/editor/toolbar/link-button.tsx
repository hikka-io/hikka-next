import React from 'react';
import MaterialSymbolsAddLinkRounded from '~icons/material-symbols/add-link-rounded';

import { openLinkEditDialog$, usePublisher } from '@mdxeditor/editor';

import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const LinkButton = () => {
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

export default LinkButton;
