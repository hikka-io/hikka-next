'use client';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import { Toolbar } from './toolbar';

const fixedToolbarVariants = cva(
    'scrollbar-hide left-0 w-full justify-between self-start p-1 z-50',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: 'sticky bottom-0 border-t',
                top: 'sticky top-0 overflow-x-auto border-b backdrop-blur-xl',
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
