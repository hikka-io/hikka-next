import React from 'react';
import MaterialSymbolsTextureAddRounded from '~icons/material-symbols/texture-add-rounded';

import { insertDirective$, usePublisher } from '@mdxeditor/editor';

import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

const SpoilerButton = () => {
    const insertDirective = usePublisher(insertDirective$);

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <Button
                    type="button"
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
