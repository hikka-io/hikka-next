import * as React from 'react';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

import { toggleVariants } from './toggle';

const ToggleGroupContext = React.createContext<
    VariantProps<typeof toggleVariants>
>({
    size: 'default',
});

function ToggleGroup({
    className,
    size,
    children,
    ...props
}: ToggleGroupPrimitive.Props & VariantProps<typeof toggleVariants>) {
    return (
        <ToggleGroupPrimitive
            data-slot="toggle-group"
            className={cn(
                // No `overflow` here: making the group a scroll container gives it a
                // flex automatic min-size of 0, so a flex parent (e.g. next to a
                // Select) shrinks it below its content and it scrolls internally
                // instead of keeping its natural width. Segmented controls should
                // size to their content.
                'flex items-center rounded-md border border-border bg-background p-0.75 shadow-xs dark:border-input dark:bg-input/30',
                className,
            )}
            {...props}
        >
            <ToggleGroupContext.Provider value={{ size }}>
                {children}
            </ToggleGroupContext.Provider>
        </ToggleGroupPrimitive>
    );
}

function ToggleGroupItem({
    className,
    children,
    size,
    ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
    const context = React.useContext(ToggleGroupContext);

    return (
        <TogglePrimitive
            data-slot="toggle-group-item"
            className={cn(
                toggleVariants({ size: context.size || size }),
                className,
            )}
            {...props}
        >
            {children}
        </TogglePrimitive>
    );
}

export { ToggleGroup, ToggleGroupItem };
