'use client';

import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { P_CLASSNAME } from '@/components/typography/p';

import { cn } from '@/utils/utils';

export function ParagraphElement(props: PlateElementProps) {
    return (
        <PlateElement as="p" {...props} className={cn('mb-4', P_CLASSNAME)}>
            {props.children}
        </PlateElement>
    );
}
