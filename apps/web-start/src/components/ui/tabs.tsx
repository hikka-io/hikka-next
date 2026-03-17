'use client';

import { Tabs as TabsPrimitive } from 'radix-ui';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const Tabs = TabsPrimitive.Root;

type TabsVariant = 'default' | 'underline';

const TabsVariantContext = React.createContext<TabsVariant>('default');

const tabsListVariants = cva(
    'inline-flex w-fit items-center justify-center text-muted-foreground',
    {
        variants: {
            variant: {
                default: 'h-10 rounded-lg bg-muted p-[3px]',
                underline:
                    'h-10 gap-1 bg-transparent border-b items-end border-border',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const tabsTriggerVariants = cva(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-[color,box-shadow,opacity] focus-visible:outline-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default:
                    'data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring dark:data-[state=active]:bg-background/40 text-foreground dark:text-muted-foreground h-[calc(100%-1px)] flex-1 rounded-md border border-transparent px-2 py-1 data-[state=active]:shadow-xs',
                underline:
                    "relative text-muted-foreground hover:text-foreground data-[state=active]:text-foreground px-4 py-0 h-full after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-1 after:rounded-full after:bg-primary-foreground after:opacity-0 after:transition-opacity data-[state=active]:after:opacity-100",
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

interface TabsListProps
    extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
        VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    TabsListProps
>(({ className, variant = 'default', ...props }, ref) => (
    <TabsVariantContext.Provider value={variant!}>
        <TabsPrimitive.List
            ref={ref}
            data-slot="tabs-list"
            className={cn(tabsListVariants({ variant, className }))}
            {...props}
        />
    </TabsVariantContext.Provider>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
    const variant = React.useContext(TabsVariantContext);

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(tabsTriggerVariants({ variant, className }))}
            {...props}
        />
    );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            'mt-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            className,
        )}
        {...props}
    />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    tabsListVariants,
    tabsTriggerVariants,
};
