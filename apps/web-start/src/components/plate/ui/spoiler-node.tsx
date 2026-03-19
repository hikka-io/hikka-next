'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { cn } from '@/utils/cn';

export function SpoilerElement(props: PlateElementProps) {
    return (
        <PlateElement
            as="div"
            className={cn(
                'border-border bg-secondary/20 mb-4 rounded-md border p-2',
                'spoiler',
            )}
            {...props}
        >
            {props.children}
        </PlateElement>
    );
}
