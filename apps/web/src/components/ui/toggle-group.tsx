import * as React from 'react';

import type { VariantProps } from 'class-variance-authority';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

import { toggleVariants } from './toggle';

const ToggleGroupContext = React.createContext<
    VariantProps<typeof toggleVariants>
>({
    size: 'default',
});

const ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
        VariantProps<typeof toggleVariants>
>(({ className, size, children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
        ref={ref}
        className={cn(
            // No `overflow` here: making the group a scroll container gives it a
            // flex automatic min-size of 0, so a flex parent (e.g. next to a
            // Select) shrinks it below its content and it scrolls internally
            // instead of keeping its natural width. Segmented controls should
            // size to their content.
            'flex items-center rounded-md border border-border bg-secondary/20 p-0.75',
            className,
        )}
        {...props}
    >
        <ToggleGroupContext.Provider value={{ size }}>
            {children}
        </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
        VariantProps<typeof toggleVariants>
>(({ className, children, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    return (
        <ToggleGroupPrimitive.Item
            ref={ref}
            className={cn(
                toggleVariants({ size: context.size || size }),
                className,
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Item>
    );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
