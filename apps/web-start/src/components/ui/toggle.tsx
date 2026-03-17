'use client';

import { Toggle as TogglePrimitive } from 'radix-ui';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-sm text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background/40 data-[state=on]:text-secondary-foreground dark:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-transparent',
                outline:
                    'border border-border hover:bg-secondary/20 hover:text-foreground',
            },
            size: {
                default: 'h-8 min-w-8 px-2.5',
                sm: 'h-8 min-w-8 px-2',
                lg: 'h-10 min-w-10 px-4',
                badge: 'px-3 py-0.5 text-xs',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const Toggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props}
    />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
