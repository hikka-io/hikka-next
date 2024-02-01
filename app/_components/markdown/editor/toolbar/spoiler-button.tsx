import React from 'react';
import MaterialSymbolsTextureAddRounded from '~icons/material-symbols/texture-add-rounded';

import { insertDirective$, usePublisher } from '@mdxeditor/editor';

import { Button } from '@/app/_components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/app/_components/ui/tooltip';


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
                <p>Спойлер</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default SpoilerButton;