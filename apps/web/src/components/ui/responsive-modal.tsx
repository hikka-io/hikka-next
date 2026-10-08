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
    PageSheet,
    PageSheetClose,
    PageSheetContent,
    PageSheetFooter,
    PageSheetHeader,
    PageSheetTrigger,
} from '@/components/ui/page-sheet';
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
import { useIsDesktop } from '@/services/hooks/use-media-query';
import { cn } from '@/utils/cn';

type ModalType = 'dialog' | 'sheet';
type MobileVariant = 'drawer' | 'page';
type Surface = ModalType | MobileVariant;

const ResponsiveModalContext = React.createContext<Surface>('dialog');

function useSurface() {
    return React.useContext(ResponsiveModalContext);
}

type ResponsiveModalProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    type?: ModalType;
    mobile?: MobileVariant;
    disablePointerDismissal?: boolean;
};

function ResponsiveModal({
    children,
    open,
    onOpenChange,
    type = 'dialog',
    mobile = 'drawer',
    disablePointerDismissal,
}: ResponsiveModalProps) {
    const isDesktop = useIsDesktop();
    const surface: Surface = isDesktop ? type : mobile;

    const root =
        surface === 'drawer' ? (
            <Drawer
                open={open}
                onOpenChange={onOpenChange}
                disablePointerDismissal={disablePointerDismissal}
            >
                {children}
            </Drawer>
        ) : surface === 'page' ? (
            <PageSheet open={open} onOpenChange={onOpenChange}>
                {children}
            </PageSheet>
        ) : surface === 'sheet' ? (
            <Sheet
                open={open}
                onOpenChange={onOpenChange}
                disablePointerDismissal={disablePointerDismissal}
            >
                {children}
            </Sheet>
        ) : (
            <Dialog
                open={open}
                onOpenChange={onOpenChange}
                disablePointerDismissal={disablePointerDismissal}
            >
                {children}
            </Dialog>
        );

    return (
        <ResponsiveModalContext.Provider value={surface}>
            {root}
        </ResponsiveModalContext.Provider>
    );
}

function ResponsiveModalTrigger({
    render,
    children,
    ...props
}: Omit<React.ComponentProps<typeof DialogTrigger>, 'handle' | 'payload'>) {
    const surface = useSurface();

    if (surface === 'drawer')
        return (
            <DrawerTrigger render={render} {...props}>
                {children}
            </DrawerTrigger>
        );
    if (surface === 'page')
        return (
            <PageSheetTrigger render={render} {...props}>
                {children}
            </PageSheetTrigger>
        );
    if (surface === 'sheet')
        return (
            <SheetTrigger render={render} {...props}>
                {children}
            </SheetTrigger>
        );
    return (
        <DialogTrigger render={render} {...props}>
            {children}
        </DialogTrigger>
    );
}

type ResponsiveModalContentProps = {
    children: React.ReactNode;
    className?: string;
    side?: 'left' | 'right' | 'top' | 'bottom';
    showCloseButton?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
};

function ResponsiveModalContent({
    children,
    className,
    side = 'right',
    showCloseButton,
    title,
    description,
}: ResponsiveModalContentProps) {
    const surface = useSurface();

    if (surface === 'page') {
        return (
            <PageSheetContent className={className}>
                <PageSheetHeader title={title} subtitle={description} />
                {children}
            </PageSheetContent>
        );
    }

    const header = title ? (
        <ResponsiveModalHeader>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
            {description && (
                <ResponsiveModalDescription>
                    {description}
                </ResponsiveModalDescription>
            )}
        </ResponsiveModalHeader>
    ) : null;

    if (surface === 'drawer') {
        return (
            <DrawerContent className={cn('max-h-[90dvh]', className)}>
                {header}
                {children}
            </DrawerContent>
        );
    }

    if (surface === 'sheet') {
        return (
            <SheetContent
                side={side}
                showCloseButton={showCloseButton}
                className={cn('max-w-lg!', className)}
            >
                {header}
                {children}
            </SheetContent>
        );
    }

    return (
        <DialogContent showCloseButton={showCloseButton} className={className}>
            {header}
            {children}
        </DialogContent>
    );
}

function ResponsiveModalHeader({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const surface = useSurface();

    if (surface === 'drawer')
        return <DrawerHeader className={className} {...props} />;
    if (surface === 'sheet')
        return <SheetHeader className={className} {...props} />;
    return <DialogHeader className={className} {...props} />;
}

function ResponsiveModalFooter({ ...props }: React.ComponentProps<'div'>) {
    const surface = useSurface();

    if (surface === 'drawer') return <DrawerFooter {...props} />;
    if (surface === 'page') return <PageSheetFooter {...props} />;
    if (surface === 'sheet') return <SheetFooter {...props} />;
    return <DialogFooter {...props} />;
}

function ResponsiveModalTitle({
    ...props
}: React.ComponentProps<typeof DialogTitle>) {
    const surface = useSurface();

    if (surface === 'drawer') return <DrawerTitle {...props} />;
    if (surface === 'sheet') return <SheetTitle {...props} />;
    return <DialogTitle {...props} />;
}

function ResponsiveModalDescription({
    ...props
}: React.ComponentProps<typeof DialogDescription>) {
    const surface = useSurface();

    if (surface === 'drawer') return <DrawerDescription {...props} />;
    if (surface === 'sheet') return <SheetDescription {...props} />;
    return <DialogDescription {...props} />;
}

function ResponsiveModalClose({
    ...props
}: React.ComponentProps<typeof DialogClose>) {
    const surface = useSurface();

    if (surface === 'drawer') return <DrawerClose {...props} />;
    if (surface === 'page') return <PageSheetClose {...props} />;
    if (surface === 'sheet') return <SheetClose {...props} />;
    return <DialogClose {...props} />;
}

export {
    ResponsiveModal,
    ResponsiveModalClose,
    ResponsiveModalContent,
    ResponsiveModalFooter,
    ResponsiveModalTrigger,
};
