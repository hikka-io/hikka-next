import * as React from 'react';

import { Drawer as DrawerPrimitive } from 'vaul';

import { PortalContainerProvider } from '@/components/ui/portal-container-context';
import { cn } from '@/utils/cn';

/**
 * The element focus should return to when the drawer closes. Captured by
 * `Drawer`, consumed by `DrawerContent`, which owns the Radix close handler.
 */
const DrawerTriggerRefContext = React.createContext<
    React.RefObject<HTMLElement | null> | undefined
>(undefined);

function Drawer({
    shouldScaleBackground = false,
    onOpenChange,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
    const triggerRef = React.useRef<HTMLElement | null>(null);

    const handleOpenChange = (open: boolean) => {
        if (open) {
            triggerRef.current =
                document.activeElement instanceof HTMLElement
                    ? document.activeElement
                    : null;
        }

        onOpenChange?.(open);
    };

    return (
        <DrawerTriggerRefContext.Provider value={triggerRef}>
            <DrawerPrimitive.Root
                data-slot="drawer"
                shouldScaleBackground={shouldScaleBackground}
                onOpenChange={handleOpenChange}
                {...props}
            />
        </DrawerTriggerRefContext.Provider>
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
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/30 backdrop-blur-xs data-[state=closed]:animate-out data-[state=open]:animate-in',
                className,
            )}
            {...props}
        />
    );
}

function DrawerContent({
    className,
    children,
    onCloseAutoFocus,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);
    const triggerRef = React.useContext(DrawerTriggerRefContext);

    const handleCloseAutoFocus = (event: Event) => {
        onCloseAutoFocus?.(event);
        if (event.defaultPrevented) return;

        event.preventDefault();
        triggerRef?.current?.focus({ preventScroll: true });
    };

    return (
        <DrawerPortal data-slot="drawer-portal">
            <DrawerOverlay />
            <DrawerPrimitive.Content
                ref={setContainer}
                data-slot="drawer-content"
                onCloseAutoFocus={handleCloseAutoFocus}
                className={cn(
                    'group/drawer-content fixed z-50 flex h-auto flex-col gap-4 bg-background p-4',
                    'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-[10px] data-[vaul-drawer-direction=top]:border-b',
                    'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-[10px] data-[vaul-drawer-direction=bottom]:border-t',
                    'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
                    'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
                    // Bottom-edge padding clears the gesture bar (viewport-fit=cover);
                    // caller pb overrides need the same variant prefix to win the merge.
                    'data-[vaul-drawer-direction=bottom]:pb-[calc(1rem+var(--safe-area-bottom))]',
                    'data-[vaul-drawer-direction=left]:pb-[calc(1rem+var(--safe-area-bottom))]',
                    'data-[vaul-drawer-direction=right]:pb-[calc(1rem+var(--safe-area-bottom))]',
                    className,
                )}
                {...props}
            >
                <PortalContainerProvider value={container}>
                    <div className="absolute top-2 left-0 flex w-full items-center justify-center">
                        <div className="mx-auto hidden h-1 w-10 shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
                    </div>
                    {children}
                </PortalContainerProvider>
            </DrawerPrimitive.Content>
        </DrawerPortal>
    );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="drawer-header"
            className={cn(
                '-mx-4 -mt-4 flex flex-col gap-0.5 border-b px-4 pt-6 pb-4 text-left',
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
                '-mx-4 -mb-4 flex flex-col gap-2 border-t p-4',
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
                'font-semibold text-sm leading-4 tracking-tight md:text-base md:leading-none',
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
            className={cn(
                'text-muted-foreground text-xs md:text-sm',
                className,
            )}
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
