import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Toggle as TogglePrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

// On-state is styled via both `data-[state=on]` and `aria-checked`: wrapping an
// item in `TooltipTrigger asChild` overwrites `data-state` with the tooltip's
// open/closed state, while `aria-checked` stays owned by the toggle group.
const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-transparent font-medium text-foreground/60 text-sm transition-all hover:text-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary data-[state=on]:text-foreground aria-checked:bg-primary aria-checked:text-foreground dark:text-muted-foreground dark:hover:text-foreground dark:data-[state=on]:text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            size: {
                default: 'h-8 min-w-8 px-2.5',
                sm: 'h-8 min-w-8 px-2',
                lg: 'h-10 min-w-10 px-4',
                badge: 'px-3 py-0.5 text-xs',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

const Toggle = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
        VariantProps<typeof toggleVariants>
>(({ className, size, ...props }, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({ size, className }))}
        {...props}
    />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };
