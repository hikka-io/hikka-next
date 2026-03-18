'use client';

import * as React from 'react';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/utils/cn';

import { useMediaQuery } from '@/services/hooks/use-media-query';

type ModalType = 'dialog' | 'sheet';

interface ResponsiveModalContextValue {
    type: ModalType;
    isDesktop: boolean;
}

const ResponsiveModalContext =
    React.createContext<ResponsiveModalContextValue>({
        type: 'dialog',
        isDesktop: true,
    });

function useResponsiveModalContext() {
    return React.useContext(ResponsiveModalContext);
}

// --- Root ---

interface ResponsiveModalProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    type?: ModalType;
    forceDesktop?: boolean;
    // Drawer-specific
    shouldScaleBackground?: boolean;
    preventScrollRestoration?: boolean;
}

function ResponsiveModal({
    children,
    open,
    onOpenChange,
    type = 'dialog',
    forceDesktop = false,
    shouldScaleBackground,
    preventScrollRestoration,
}: ResponsiveModalProps) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const useDesktop = isDesktop || forceDesktop;

    const ctx = React.useMemo(
        () => ({ type, isDesktop: useDesktop }),
        [type, useDesktop],
    );

    if (!useDesktop) {
        return (
            <ResponsiveModalContext.Provider value={ctx}>
                <Drawer
                    open={open}
                    onOpenChange={onOpenChange}
                    shouldScaleBackground={shouldScaleBackground}
                    preventScrollRestoration={preventScrollRestoration}
                >
                    {children}
                </Drawer>
            </ResponsiveModalContext.Provider>
        );
    }

    if (type === 'sheet') {
        return (
            <ResponsiveModalContext.Provider value={ctx}>
                <Sheet open={open} onOpenChange={onOpenChange}>
                    {children}
                </Sheet>
            </ResponsiveModalContext.Provider>
        );
    }

    return (
        <ResponsiveModalContext.Provider value={ctx}>
            <Dialog open={open} onOpenChange={onOpenChange}>
                {children}
            </Dialog>
        </ResponsiveModalContext.Provider>
    );
}

// --- Trigger ---

function ResponsiveModalTrigger({
    ...props
}: React.ComponentProps<typeof DialogTrigger>) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) return <DrawerTrigger {...props} />;
    if (type === 'sheet') return <SheetTrigger {...props} />;
    return <DialogTrigger {...props} />;
}

// --- Content ---

interface ResponsiveModalContentProps {
    children: React.ReactNode;
    className?: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    showCloseButton?: boolean;
    onPointerDownOutside?: (e: PointerEvent) => void;
    onEscapeKeyDown?: (e: KeyboardEvent) => void;
    onInteractOutside?: (e: Event) => void;
}

function ResponsiveModalContent({
    children,
    className,
    side = 'right',
    showCloseButton,
    onPointerDownOutside,
    onEscapeKeyDown,
    onInteractOutside,
}: ResponsiveModalContentProps) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) {
        return (
            <DrawerContent
                className={cn('max-h-[90dvh]', className)}
                onPointerDownOutside={onPointerDownOutside as any}
                onEscapeKeyDown={onEscapeKeyDown as any}
                onInteractOutside={onInteractOutside as any}
            >
                {children}
            </DrawerContent>
        );
    }

    if (type === 'sheet') {
        return (
            <SheetContent
                side={side}
                showCloseButton={showCloseButton}
                className={cn(
                    'flex !max-w-lg flex-col gap-0 p-0',
                    className,
                )}
                onPointerDownOutside={onPointerDownOutside as any}
                onEscapeKeyDown={onEscapeKeyDown as any}
                onInteractOutside={onInteractOutside as any}
            >
                {children}
            </SheetContent>
        );
    }

    return (
        <DialogContent
            showCloseButton={showCloseButton}
            className={cn(className)}
            onPointerDownOutside={onPointerDownOutside as any}
            onEscapeKeyDown={onEscapeKeyDown as any}
            onInteractOutside={onInteractOutside as any}
        >
            {children}
        </DialogContent>
    );
}

// --- Header ---

function ResponsiveModalHeader({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) return <DrawerHeader className={className} {...props} />;
    if (type === 'sheet')
        return <SheetHeader className={cn('px-6 py-4', className)} {...props} />;
    return <DialogHeader className={className} {...props} />;
}

// --- Footer ---

function ResponsiveModalFooter({
    ...props
}: React.ComponentProps<'div'>) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) return <DrawerFooter {...props} />;
    if (type === 'sheet') return <SheetFooter {...props} />;
    return <DialogFooter {...props} />;
}

// --- Title ---

function ResponsiveModalTitle({
    ...props
}: React.ComponentProps<typeof DialogTitle>) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) return <DrawerTitle {...props} />;
    if (type === 'sheet') return <SheetTitle {...props} />;
    return <DialogTitle {...props} />;
}

// --- Description ---

function ResponsiveModalDescription({
    ...props
}: React.ComponentProps<typeof DialogDescription>) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) return <DrawerDescription {...props} />;
    if (type === 'sheet') return <SheetDescription {...props} />;
    return <DialogDescription {...props} />;
}

// --- Close ---

function ResponsiveModalClose({
    ...props
}: React.ComponentProps<typeof DialogClose>) {
    const { isDesktop, type } = useResponsiveModalContext();

    if (!isDesktop) return <DrawerClose {...props} />;
    if (type === 'sheet') return <SheetClose {...props} />;
    return <DialogClose {...props} />;
}

// --- Separator (convenience) ---

function ResponsiveModalSeparator() {
    return <Separator />;
}

export {
    ResponsiveModal,
    ResponsiveModalClose,
    ResponsiveModalContent,
    ResponsiveModalDescription,
    ResponsiveModalFooter,
    ResponsiveModalHeader,
    ResponsiveModalSeparator,
    ResponsiveModalTitle,
    ResponsiveModalTrigger,
};
