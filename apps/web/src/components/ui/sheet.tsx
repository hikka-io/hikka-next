import * as React from 'react';

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { footerBarClassName } from '@/components/ui/footer-bar';
import { PortalContainerProvider } from '@/components/ui/portal-container-context';
import { useBackClose } from '@/services/hooks/use-back-close';
import { cn } from '@/utils/cn';

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
    useBackClose(props.open, props.onOpenChange);

    return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
    return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
    return (
        <SheetPrimitive.Backdrop
            forceRender
            data-slot="sheet-overlay"
            className={cn(
                'fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
                className,
            )}
            {...props}
        />
    );
}

function SheetContent({
    className,
    children,
    side = 'right',
    showCloseButton = true,
    ...props
}: SheetPrimitive.Popup.Props & {
    side?: 'top' | 'right' | 'bottom' | 'left';
    showCloseButton?: boolean;
}) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Popup
                ref={setContainer}
                data-slot="sheet-content"
                data-side={side}
                className={cn(
                    'fixed z-50 flex flex-col gap-4 bg-background bg-clip-padding p-4 text-sm shadow-lg transition-[opacity,translate] duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:data-ending-style:translate-y-full data-[side=bottom]:data-starting-style:translate-y-full data-[side=top]:data-ending-style:-translate-y-full data-[side=top]:data-starting-style:-translate-y-full data-[side=left]:data-ending-style:-translate-x-full data-[side=left]:data-starting-style:-translate-x-full data-[side=right]:data-ending-style:translate-x-full data-[side=right]:data-starting-style:translate-x-full data-[side=bottom]:inset-x-0 data-[side=top]:inset-x-0 data-[side=left]:inset-y-0 data-[side=right]:inset-y-0 data-[side=top]:top-0 data-[side=right]:right-0 data-[side=bottom]:bottom-0 data-[side=left]:left-0 data-[side=bottom]:h-auto data-[side=left]:h-full data-[side=right]:h-full data-[side=top]:h-auto data-[side=bottom]:max-h-[calc(var(--visual-viewport-height,100dvh)-1rem)] data-[side=top]:max-h-[calc(var(--visual-viewport-height,100dvh)-1rem)] data-[side=left]:w-3/4 data-[side=right]:w-3/4 data-[side=bottom]:border-t data-[side=left]:border-r data-[side=top]:border-b data-[side=right]:border-l data-[side=left]:pt-[calc(1rem+env(safe-area-inset-top,0px))] data-[side=right]:pt-[calc(1rem+env(safe-area-inset-top,0px))] data-[side=top]:pt-[calc(1rem+env(safe-area-inset-top,0px))] data-[side=bottom]:pb-[calc(1rem+var(--safe-area-bottom))] data-[side=left]:pb-[calc(1rem+var(--safe-area-bottom))] data-[side=right]:pb-[calc(1rem+var(--safe-area-bottom))] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm',
                    className,
                )}
                {...props}
            >
                <PortalContainerProvider value={container}>
                    {children}
                </PortalContainerProvider>
                {showCloseButton && (
                    <SheetPrimitive.Close
                        data-slot="sheet-close"
                        render={
                            <Button
                                variant="outline"
                                className="absolute top-2 right-3"
                                size="icon-sm"
                            />
                        }
                    >
                        <X />
                        <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                )}
            </SheetPrimitive.Popup>
        </SheetPortal>
    );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sheet-header"
            className={cn(
                '-mx-4 -mt-4 flex flex-col gap-0.5 border-b p-4 pr-12',
                className,
            )}
            {...props}
        />
    );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sheet-footer"
            className={cn('-mx-4 -mb-4', footerBarClassName, className)}
            {...props}
        />
    );
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
    return (
        <SheetPrimitive.Title
            data-slot="sheet-title"
            className={cn(
                'font-display font-semibold text-foreground text-sm leading-4 md:text-base md:leading-none',
                className,
            )}
            {...props}
        />
    );
}

function SheetDescription({
    className,
    ...props
}: SheetPrimitive.Description.Props) {
    return (
        <SheetPrimitive.Description
            data-slot="sheet-description"
            className={cn(
                'text-muted-foreground text-xs md:text-sm',
                className,
            )}
            {...props}
        />
    );
}

export {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetOverlay,
    SheetPortal,
    SheetTitle,
    SheetTrigger,
};
