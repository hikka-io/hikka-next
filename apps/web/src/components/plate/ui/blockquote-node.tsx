'use client';

import { PlateElement, type PlateElementProps } from 'platejs/react';

import { BLOCKQUOTE_CLASSNAME } from '@/components/typography/blockquote';

import { cn } from '@/utils/cn';

export function BlockquoteElement(props: PlateElementProps) {
    return (
        <PlateElement
            as="blockquote"
            className={cn(BLOCKQUOTE_CLASSNAME, 'mb-4')}
            {...props}
        />
    );
}
