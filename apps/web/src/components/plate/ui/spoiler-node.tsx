'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { cn } from '@/utils/utils';

export function SpoilerElement(props: PlateElementProps) {
    return (
        <PlateElement
            as="div"
            className={cn(
                'mb-4 rounded-md border border-border bg-secondary/20 p-2',
                'spoiler',
            )}
            {...props}
        >
            {props.children}
        </PlateElement>
    );
}
