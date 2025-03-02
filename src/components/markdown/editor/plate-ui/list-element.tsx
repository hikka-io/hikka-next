'use client';

import { withRef, withVariants } from '@udecode/cn';
import { cva } from 'class-variance-authority';

import { PlateElement } from './plate-element';

const listVariants = cva('', {
    variants: {
        variant: {
            ol: 'ml-6 list-decimal [&>li]:my-2',
            ul: 'ml-6 list-disc [&>li]:my-2',
        },
    },
});

const ListElementVariants = withVariants(PlateElement, listVariants, [
    'variant',
]);

export const ListElement = withRef<typeof ListElementVariants>(
    ({ children, variant = 'ul', ...props }, ref) => {
        return (
            <ListElementVariants
                ref={ref}
                as={variant!}
                variant={variant}
                {...props}
            >
                {children}
            </ListElementVariants>
        );
    },
);
