'use client';

import { withRef, withVariants } from '@udecode/cn';
import { cva } from 'class-variance-authority';

import { PlateElement } from './plate-element';

const listVariants = cva('m-0 ps-6 text-base', {
    variants: {
        variant: {
            ol: 'list-decimal mb-4',
            ul: 'list-disc [&_ul]:list-[circle] [&_ul_ul]:list-[square] mb-4',
        },
    },
});

const ListViewElementVariants = withVariants(PlateElement, listVariants, [
    'variant',
]);

export const ListViewElement = withRef<typeof ListViewElementVariants>(
    ({ children, variant = 'ul', ...props }, ref) => {
        return (
            <ListViewElementVariants
                ref={ref}
                as={variant!}
                variant={variant}
                {...props}
            >
                {children}
            </ListViewElementVariants>
        );
    },
);
