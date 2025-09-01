'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { cn } from '@/utils/utils';

export function ParagraphElement(props: PlateElementProps) {
    return (
        <PlateElement as="p" {...props} className={cn('mb-4')}>
            {props.children}
        </PlateElement>
    );
}
