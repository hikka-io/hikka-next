import { Slot as SlotPrimitive } from 'radix-ui';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const statItemVariants = cva(
    'inline-flex items-center text-muted-foreground',
    {
        variants: {
            size: {
                default:
                    'h-8 gap-1 rounded-lg px-2 text-sm font-normal transition-colors hover:bg-secondary/60 hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0',
                sm: 'gap-1 text-xs [&_svg]:size-3 [&_svg]:shrink-0',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

export interface StatItemProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof statItemVariants> {
    asChild?: boolean;
}

const StatItem = React.forwardRef<HTMLButtonElement, StatItemProps>(
    ({ className, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? SlotPrimitive.Slot : 'button';
        return (
            <Comp
                className={cn(statItemVariants({ size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
StatItem.displayName = 'StatItem';

const statItemGroupVariants = cva('flex items-center', {
    variants: {
        size: {
            default: 'gap-1',
            sm: 'gap-3',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

export interface StatItemGroupProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof statItemGroupVariants> {}

const StatItemGroup = React.forwardRef<HTMLDivElement, StatItemGroupProps>(
    ({ className, size, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(statItemGroupVariants({ size, className }))}
            {...props}
        />
    ),
);
StatItemGroup.displayName = 'StatItemGroup';

export { StatItem, statItemVariants, StatItemGroup, statItemGroupVariants };
