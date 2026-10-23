import type * as React from 'react';

import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { STAY_ON_AXIS } from '@/components/ui/popup-positioning';
import { usePortalContainer } from '@/components/ui/portal-container-context';
import { cn } from '@/utils/cn';

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
    className,
    align = 'center',
    alignOffset = 0,
    side = 'bottom',
    sideOffset = 4,
    anchor,
    ...props
}: PopoverPrimitive.Popup.Props &
    Pick<
        PopoverPrimitive.Positioner.Props,
        'align' | 'alignOffset' | 'anchor' | 'side' | 'sideOffset'
    >) {
    const portalContainer = usePortalContainer();

    return (
        <PopoverPrimitive.Portal container={portalContainer ?? undefined}>
            <PopoverPrimitive.Positioner
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                anchor={anchor}
                collisionAvoidance={STAY_ON_AXIS}
                className="isolate z-50"
            >
                <PopoverPrimitive.Popup
                    data-slot="popover-content"
                    className={cn(
                        'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-md border bg-popover p-2.5 text-popover-foreground text-sm shadow-md outline-hidden transition-[opacity,scale,translate] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=bottom]:data-ending-style:-translate-y-1 data-[side=top]:data-starting-style:translate-y-1 data-[side=top]:data-ending-style:translate-y-1 data-[side=left]:data-starting-style:translate-x-1 data-[side=left]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:-translate-x-1',
                        className,
                    )}
                    {...props}
                />
            </PopoverPrimitive.Positioner>
        </PopoverPrimitive.Portal>
    );
}

function PopoverAnchor({ ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="popover-anchor" {...props} />;
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="popover-header"
            className={cn('flex flex-col gap-0.5 text-sm', className)}
            {...props}
        />
    );
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
    return (
        <PopoverPrimitive.Title
            data-slot="popover-title"
            className={cn('font-medium', className)}
            {...props}
        />
    );
}

function PopoverDescription({
    className,
    ...props
}: PopoverPrimitive.Description.Props) {
    return (
        <PopoverPrimitive.Description
            data-slot="popover-description"
            className={cn('text-muted-foreground', className)}
            {...props}
        />
    );
}

const PopoverPortal = PopoverPrimitive.Portal;

export {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverPortal,
    PopoverTitle,
    PopoverTrigger,
};
