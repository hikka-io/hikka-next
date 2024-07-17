'use client';

import { PlateElement } from '@udecode/plate-common';

import { cn, withRef } from '@/utils/utils';

export const BlockquoteElement = withRef<typeof PlateElement>(
    ({ children, className, ...props }, ref) => {
        return (
            <PlateElement
                asChild
                className={cn('my-1 border-l-2 pl-6 italic', className)}
                ref={ref}
                {...props}
            >
                <blockquote>{children}</blockquote>
            </PlateElement>
        );
    },
);
