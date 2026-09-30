import * as React from 'react';

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { modalFooterBarClassName } from '@/components/ui/footer-bar';
import { PortalContainerProvider } from '@/components/ui/portal-container-context';
import { useBackClose } from '@/services/hooks/use-back-close';
import { cn } from '@/utils/cn';

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
    useBackClose(props.open, props.onOpenChange);

    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: DialogPrimitive.Backdrop.Props) {
    return (
        <DialogPrimitive.Backdrop
            forceRender
            data-slot="dialog-overlay"
            className={cn(
                'fixed inset-0 isolate z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs',
                className,
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: DialogPrimitive.Popup.Props & {
    showCloseButton?: boolean;
}) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
                ref={setContainer}
                data-slot="dialog-content"
                className={cn(
                    'fixed top-24 left-1/2 z-50 flex max-h-[calc(var(--visual-viewport-height,100dvh)-6rem)] w-full max-w-full -translate-x-1/2 flex-col gap-4 bg-background p-4 text-sm outline-none ring-1 ring-border transition-[opacity,scale] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 md:top-1/2 md:max-h-[calc(var(--visual-viewport-height,100dvh)-2rem)] md:max-w-sm md:-translate-y-1/2 md:rounded-xl',
                    className,
                )}
                {...props}
            >
                <PortalContainerProvider value={container}>
                    {children}
                </PortalContainerProvider>
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        render={
                            <Button
                                variant="outline"
                                className="absolute top-2 right-2"
                                size="icon-sm"
                            />
                        }
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Popup>
        </DialogPortal>
    );
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="dialog-header"
            className={cn(
                '-mx-4 -mt-4 flex flex-col gap-0.5 border-b p-4 pr-12',
                className,
            )}
            {...props}
        />
    );
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    showCloseButton?: boolean;
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                '-mx-4 -mb-4 md:rounded-b-xl',
                modalFooterBarClassName,
                className,
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close render={<Button variant="outline" />}>
                    Close
                </DialogPrimitive.Close>
            )}
        </div>
    );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn(
                'truncate font-semibold text-sm leading-4 md:text-base md:leading-none',
                className,
            )}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: DialogPrimitive.Description.Props) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn(
                'text-muted-foreground text-xs *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground md:text-sm',
                className,
            )}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
