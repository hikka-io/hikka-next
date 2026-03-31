'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/utils/cn';

function Drawer({
    shouldScaleBackground = false,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
    return (
        <DrawerPrimitive.Root
            data-slot="drawer"
            shouldScaleBackground={shouldScaleBackground}
            {...props}
        />
    );
}

function DrawerTrigger({
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
    return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
    return (
        <DrawerPrimitive.Overlay
            data-slot="drawer-overlay"
            className={cn(
                'fixed inset-0 z-50 bg-black/30 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
                className,
            )}
            {...props}
        />
    );
}

function DrawerContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
    return (
        <DrawerPortal data-slot="drawer-portal">
            <DrawerOverlay />
            <DrawerPrimitive.Content
                data-slot="drawer-content"
                className={cn(
                    'group/drawer-content bg-background fixed z-50 flex h-auto flex-col gap-4 p-4',
                    'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-[10px] data-[vaul-drawer-direction=top]:border-b',
                    'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-[10px] data-[vaul-drawer-direction=bottom]:border-t',
                    'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
                    'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
                    className,
                )}
                {...props}
            >
                <div className="bg-muted mx-auto hidden h-1 w-10 shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
                {children}
            </DrawerPrimitive.Content>
        </DrawerPortal>
    );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="drawer-header"
            className={cn(
                'bg-secondary/20 -mx-4 -mt-4 grid gap-1.5 border-b p-4 text-center group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center sm:text-left',
                className,
            )}
            {...props}
        />
    );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="drawer-footer"
            className={cn(
                'bg-secondary/20 -mx-4 -mb-4 flex flex-col gap-2 border-t p-4',
                className,
            )}
            {...props}
        />
    );
}

function DrawerTitle({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
    return (
        <DrawerPrimitive.Title
            data-slot="drawer-title"
            className={cn(
                'text-base leading-none font-semibold tracking-tight',
                className,
            )}
            {...props}
        />
    );
}

function DrawerDescription({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
    return (
        <DrawerPrimitive.Description
            data-slot="drawer-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerPortal,
    DrawerTitle,
    DrawerTrigger,
};
