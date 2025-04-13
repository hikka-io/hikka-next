'use client';

import { cn } from '@udecode/cn';
import type { PlateElementProps } from '@udecode/plate/react';
import { PlateElement as PlateElementPrimitive } from '@udecode/plate/react';
import React from 'react';

import { BlockSelection } from './block-selection';

export const PlateElement = React.forwardRef<HTMLDivElement, PlateElementProps>(
    ({ children, className, ...props }: PlateElementProps, ref) => {
        return (
            <PlateElementPrimitive
                ref={ref}
                className={cn('relative', className)}
                {...props}
            >
                {children}

                {className?.includes('slate-selectable') && <BlockSelection />}
            </PlateElementPrimitive>
        );
    },
);
