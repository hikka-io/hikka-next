import * as React from 'react';

import { ChevronLeft } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { Button } from '@/components/ui/button';
import { PortalContainerProvider } from '@/components/ui/portal-container-context';
import {
    Sheet,
    SheetClose,
    SheetFooter,
    SheetOverlay,
    SheetPortal,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/utils/cn';

function PageSheetContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof SheetPrimitive.Content>) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                ref={setContainer}
                data-slot="page-sheet-content"
                className={cn(
                    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right fixed inset-0 z-50 flex h-full w-full flex-col gap-4 bg-background bg-clip-padding p-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-[calc(1rem+var(--safe-area-bottom))] text-sm transition duration-200 ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in',
                    className,
                )}
                {...props}
            >
                <PortalContainerProvider value={container}>
                    {children}
                </PortalContainerProvider>
            </SheetPrimitive.Content>
        </SheetPortal>
    );
}

type PageSheetHeaderProps = {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

function PageSheetHeader({
    title,
    subtitle,
    actions,
    className,
}: PageSheetHeaderProps) {
    return (
        <div
            data-slot="page-sheet-header"
            className={cn(
                '-mx-4 -mt-4 flex h-14 shrink-0 items-center gap-1 border-b px-2',
                className,
            )}
        >
            <SheetClose asChild>
                <Button
                    variant="ghost"
                    size="icon-md"
                    className="[&_svg]:size-6"
                    aria-label="Назад"
                >
                    <ChevronLeft />
                </Button>
            </SheetClose>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
                <SheetPrimitive.Title className="truncate font-semibold text-sm">
                    {title}
                </SheetPrimitive.Title>
                {subtitle && (
                    <SheetPrimitive.Description className="truncate text-muted-foreground text-xs">
                        {subtitle}
                    </SheetPrimitive.Description>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export {
    PageSheetContent,
    PageSheetHeader,
    Sheet as PageSheet,
    SheetClose as PageSheetClose,
    SheetFooter as PageSheetFooter,
    SheetTrigger as PageSheetTrigger,
};
