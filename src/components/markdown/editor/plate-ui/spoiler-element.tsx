'use client';

import { cn, withRef } from '@udecode/cn';
import React from 'react';

import { PlateElement } from './plate-element';

export const SpoilerElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        return (
            <PlateElement
                ref={ref}
                as="div"
                className={cn(
                    'mb-4 rounded-md border border-secondary/60 bg-secondary/30 p-2',
                    className,
                )}
                {...props}
            >
                {children}
            </PlateElement>
        );
    },
);
