import { insertDirective$, usePublisher } from '@mdxeditor/editor';
import { Button } from '@/app/_components/ui/button';
import MaterialSymbolsTextureAddRounded from '~icons/material-symbols/texture-add-rounded';
import React from 'react';

const SpoilerButton = () => {
    const insertDirective = usePublisher(insertDirective$);

    return (
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
    );
};

export default SpoilerButton;