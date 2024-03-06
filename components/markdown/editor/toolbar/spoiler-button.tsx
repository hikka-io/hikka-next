import React from 'react';
import MaterialSymbolsTextureAddRounded from '~icons/material-symbols/texture-add-rounded';

import { insertDirective$, usePublisher } from '@mdxeditor/editor';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import P from '@/components/typography/p';


const SpoilerButton = () => {
    const insertDirective = usePublisher(insertDirective$);

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                        insertDirective({
                            name: 'spoiler',
                            type: 'containerDirective',
                        });
                    }}
                >
                    <MaterialSymbolsTextureAddRounded />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <P>Спойлер</P>
            </TooltipContent>
        </Tooltip>
    );
};

export default SpoilerButton;