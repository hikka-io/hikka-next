'use client';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import { Toolbar } from './toolbar';

const fixedToolbarVariants = cva(
    'scrollbar-hide left-0 w-full justify-between self-start p-1 z-50 bg-secondary/20 backdrop-blur rounded-md',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: 'sticky bottom-0 border-t',
                top: 'sticky top-26 md:top:16 overflow-x-auto border-b',
            },
        },
    },
);

export function FixedToolbar(
    props: React.ComponentProps<typeof Toolbar> &
        VariantProps<typeof fixedToolbarVariants>,
) {
    return (
        <Toolbar
            {...props}
            className={cn(
                fixedToolbarVariants({ variant: props.variant }),
                props.className,
            )}
        />
    );
}
