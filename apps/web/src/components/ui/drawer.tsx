import * as React from 'react';

import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer';

import { modalFooterBarClassName } from '@/components/ui/footer-bar';
import {
    PortalContainerProvider,
    usePortalContainer,
} from '@/components/ui/portal-container-context';
import { useBackClose } from '@/services/hooks/use-back-close';
import { cn } from '@/utils/cn';

type DrawerContextValue = {
    modal: DrawerPrimitive.Root.Props['modal'];
    showSwipeHandle: boolean;
    swipeDirection: NonNullable<DrawerPrimitive.Root.Props['swipeDirection']>;
};

const DrawerContext = React.createContext<DrawerContextValue | null>(null);

function useDrawer() {
    const context = React.useContext(DrawerContext);

    if (!context) {
        throw new Error('useDrawer must be used within a Drawer.');
    }

    return context;
}

function Drawer({
    modal = true,
    showSwipeHandle = true,
    swipeDirection = 'down',
    ...props
}: DrawerPrimitive.Root.Props & {
    showSwipeHandle?: boolean;
}) {
    useBackClose(props.open, props.onOpenChange);

    const contextValue = React.useMemo(
        () => ({ modal, showSwipeHandle, swipeDirection }),
        [modal, showSwipeHandle, swipeDirection],
    );

    return (
        <DrawerContext.Provider value={contextValue}>
            <DrawerPrimitive.Root
                data-slot="drawer"
                modal={modal}
                swipeDirection={swipeDirection}
                {...props}
            />
        </DrawerContext.Provider>
    );
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ container, ...props }: DrawerPrimitive.Portal.Props) {
    const modalContainer = usePortalContainer();

    return (
        <DrawerPrimitive.Portal
            data-slot="drawer-portal"
            container={container ?? modalContainer ?? undefined}
            {...props}
        />
    );
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
    className,
    ...props
}: DrawerPrimitive.Backdrop.Props) {
    return (
        <DrawerPrimitive.Backdrop
            forceRender
            data-slot="drawer-overlay"
            className={cn(
                'fixed inset-0 z-50 min-h-dvh select-none bg-black/30 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-xs transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0',
                className,
            )}
            {...props}
        />
    );
}

function DrawerSwipeHandle({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    const { swipeDirection } = useDrawer();

    return (
        <div
            data-slot="drawer-swipe-handle"
            aria-hidden="true"
            className={cn(
                'absolute inset-x-0 z-10 flex cursor-grab justify-center transition-opacity duration-200 group-data-nested-drawer-open/drawer-popup:opacity-0 group-data-nested-drawer-swiping/drawer-popup:opacity-100 active:cursor-grabbing',
                swipeDirection === 'up'
                    ? 'bottom-0 pt-1 pb-2'
                    : 'top-0 pt-2 pb-1',
                className,
            )}
            {...props}
        >
            <div className="h-1 w-10 rounded-full bg-muted" />
        </div>
    );
}

function DrawerContent({
    className,
    children,
    ...props
}: DrawerPrimitive.Popup.Props) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);
    const { modal, showSwipeHandle, swipeDirection } = useDrawer();
    const swipeAxis =
        swipeDirection === 'down' || swipeDirection === 'up' ? 'y' : 'x';

    return (
        <DrawerPortal>
            {modal === true && <DrawerOverlay />}
            <DrawerPrimitive.Viewport
                data-slot="drawer-viewport"
                data-modal={modal}
                className="pointer-events-none fixed inset-0 z-50 select-none data-[modal=true]:pointer-events-auto"
            >
                <DrawerPrimitive.Popup
                    data-slot="drawer-popup"
                    data-swipe-axis={swipeAxis}
                    className={cn(
                        'group/drawer-popup pointer-events-auto fixed z-50 flex h-(--drawer-content-height) max-h-(--drawer-content-max-height,none) min-h-0 w-(--drawer-content-width,auto) transform-[translate3d(var(--translate-x,0px),var(--translate-y,0px),0)_scale(var(--stack-scale))] select-none flex-col gap-4 bg-background p-4 pb-[calc(1rem+var(--safe-area-bottom))] outline-none transition-[transform,height,opacity,filter] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform',
                        'data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95',
                        // The bleed keeps the surface colour past the edge while the
                        // drawer rubber-bands under a swipe.
                        'after:pointer-events-none after:absolute after:bg-background data-[swipe-axis=x]:after:inset-y-0 data-[swipe-axis=x]:after:w-(--bleed) data-[swipe-axis=y]:after:inset-x-0 data-[swipe-axis=y]:after:h-(--bleed) data-[swipe-direction=down]:after:top-full data-[swipe-direction=left]:after:right-full data-[swipe-direction=right]:after:left-full data-[swipe-direction=up]:after:bottom-full',
                        '[--drawer-content-height:auto] data-[swipe-axis=x]:[--drawer-content-width:75%] data-[swipe-axis=y]:[--drawer-content-max-height:80dvh] data-[swipe-axis=x]:sm:[--drawer-content-width:24rem]',
                        '[--bleed:3rem] [--peek:1rem] [--stack-height:var(--drawer-frontmost-height,0px)] [--stack-peek-offset:max(0px,calc((var(--nested-drawers)-var(--stack-progress))*var(--peek)))] [--stack-progress:clamp(0,var(--drawer-swipe-progress),1)] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] [--stack-step:0.05]',
                        'data-ending-style:transform-(--closed-transform) data-ending-style:opacity-[0.9999] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-nested-drawer-swiping:duration-0 data-ending-style:data-nested-drawer-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-(--closed-transform) data-swiping:duration-0 data-ending-style:data-swiping:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
                        'data-[swipe-axis=y]:inset-x-0 data-[swipe-axis=y]:data-nested-drawer-open:h-(--stack-height)',
                        'data-[swipe-axis=x]:inset-y-0 data-[swipe-axis=x]:flex-row',
                        'data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:origin-bottom data-[swipe-direction=down]:rounded-t-[10px] data-[swipe-direction=down]:border-t data-[swipe-direction=down]:[--closed-transform:translate3d(0,calc(100%+2px),0)] data-[swipe-direction=down]:[--translate-y:calc(var(--drawer-swipe-movement-y)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))]',
                        'data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:origin-top data-[swipe-direction=up]:rounded-b-[10px] data-[swipe-direction=up]:border-b data-[swipe-direction=up]:[--closed-transform:translate3d(0,calc(-100%-2px),0)] data-[swipe-direction=up]:[--translate-y:calc(var(--drawer-swipe-movement-y)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))]',
                        'data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:origin-left data-[swipe-direction=left]:border-r data-[swipe-direction=left]:[--closed-transform:translate3d(calc(-100%-2px),0,0)] data-[swipe-direction=left]:[--translate-x:calc(var(--drawer-swipe-movement-x)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))]',
                        'data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:origin-right data-[swipe-direction=right]:border-l data-[swipe-direction=right]:[--closed-transform:translate3d(calc(100%+2px),0,0)] data-[swipe-direction=right]:[--translate-x:calc(var(--drawer-swipe-movement-x)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))]',
                        className,
                    )}
                    {...props}
                >
                    {showSwipeHandle && swipeAxis === 'y' && (
                        <DrawerSwipeHandle />
                    )}
                    {/* `contents` keeps the popup as the single styled surface the
                        app already lays out against; Base UI only needs this element
                        in the tree to exclude its subtree from swipe-to-dismiss. */}
                    <DrawerPrimitive.Content
                        data-slot="drawer-content"
                        ref={setContainer}
                        className="contents"
                    >
                        <PortalContainerProvider value={container}>
                            {children}
                        </PortalContainerProvider>
                    </DrawerPrimitive.Content>
                </DrawerPrimitive.Popup>
            </DrawerPrimitive.Viewport>
        </DrawerPortal>
    );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="drawer-header"
            className={cn(
                '-mx-4 -mt-4 flex shrink-0 flex-col gap-0.5 border-b px-4 pt-6 pb-4 text-left',
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
                '-mx-4 -mb-[calc(1rem+var(--safe-area-bottom))] mt-auto shrink-0',
                modalFooterBarClassName,
                className,
            )}
            {...props}
        />
    );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
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
}: DrawerPrimitive.Description.Props) {
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
    DrawerSwipeHandle,
    DrawerTitle,
    DrawerTrigger,
};
