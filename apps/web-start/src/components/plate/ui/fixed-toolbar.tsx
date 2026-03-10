'use client';

import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import { Toolbar } from './toolbar';

const fixedToolbarVariants = cva(
    'scrollbar-hide supports-backdrop-blur:bg-secondary/20 left-0 w-full justify-between self-start bg-secondary/20 p-1',
    {
        defaultVariants: {
            variant: 'default',
        },
        variants: {
            variant: {
                default: cn(
                    'flex border border-border md:sticky md:top-16 md:z-50 md:mx-0 md:overflow-x-auto md:rounded-none md:rounded-t-lg md:border-0 md:border-b md:backdrop-blur-xl',
                ),
                article: cn(
                    'sticky top-[104px] z-50 overflow-x-auto rounded-t-lg border-b border-b-border backdrop-blur-xl md:top-16',
                ),
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
                //'scrollbar-hide supports-backdrop-blur:bg-secondary/20 left-0 flex w-full justify-between self-start border border-border bg-secondary/20 p-1 md:sticky md:top-16 md:z-50 md:mx-0 md:overflow-x-auto md:rounded-none md:rounded-t-lg md:border-0 md:border-b md:backdrop-blur-xl',
                fixedToolbarVariants({ variant: props.variant }),
                props.className,
            )}
        />
    );
}
