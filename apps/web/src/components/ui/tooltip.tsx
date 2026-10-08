import * as React from 'react';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { STAY_ON_AXIS } from '@/components/ui/popup-positioning';
import { cn } from '@/utils/cn';

function TooltipProvider({
    delay = 0,
    ...props
}: TooltipPrimitive.Provider.Props) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delay={delay}
            {...props}
        />
    );
}

// Base UI keeps `delay` on the provider, so a per-tooltip delay needs its own provider.
function Tooltip({
    delay,
    ...props
}: TooltipPrimitive.Root.Props & { delay?: number }) {
    const root = <TooltipPrimitive.Root data-slot="tooltip" {...props} />;

    if (delay === undefined) return root;

    return <TooltipProvider delay={delay}>{root}</TooltipProvider>;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipArrow = TooltipPrimitive.Arrow;

function TooltipContent({
    className,
    side = 'top',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    anchor,
    children,
    ...props
}: TooltipPrimitive.Popup.Props &
    Pick<
        TooltipPrimitive.Positioner.Props,
        'align' | 'alignOffset' | 'anchor' | 'side' | 'sideOffset'
    >) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner
                anchor={anchor}
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                collisionAvoidance={STAY_ON_AXIS}
                className="isolate z-50"
            >
                <TooltipPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        'z-50 w-fit origin-(--transform-origin) text-balance rounded-md bg-tooltip px-3 py-1.5 text-tooltip-foreground text-xs shadow-md transition-[opacity,scale,translate] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=bottom]:data-ending-style:-translate-y-1 data-[side=top]:data-starting-style:translate-y-1 data-[side=top]:data-ending-style:translate-y-1 data-[side=left]:data-starting-style:translate-x-1 data-[side=left]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:-translate-x-1',
                        className,
                    )}
                    {...props}
                >
                    {children}
                    {/* Base UI positions the arrow along the edge inline; the offset only centres
                        the rotated square on that edge, so half of it stays under the popup. */}
                    <TooltipPrimitive.Arrow className="size-2.5 rotate-45 rounded-[2px] bg-tooltip fill-tooltip data-[side=bottom]:-top-[3px] data-[side=left]:-right-[4px] data-[side=top]:-bottom-[4px] data-[side=right]:-left-[4px]" />
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    );
}

function withTooltip<
    T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
>(Component: T) {
    return React.forwardRef<
        React.ComponentRef<T>,
        {
            tooltip?: React.ReactNode;
            tooltipContentProps?: Omit<
                React.ComponentProps<typeof TooltipContent>,
                'children'
            >;
            tooltipProps?: Omit<TooltipPrimitive.Root.Props, 'children'>;
        } & React.ComponentPropsWithoutRef<T>
    >(function ExtendComponent(
        { tooltip, tooltipContentProps, tooltipProps, ...props },
        ref,
    ) {
        const [mounted, setMounted] = React.useState(false);

        React.useEffect(() => {
            setMounted(true);
        }, []);

        const component = <Component ref={ref} {...(props as any)} />;

        if (tooltip && mounted) {
            return (
                <Tooltip {...tooltipProps}>
                    <TooltipTrigger render={component} />
                    <TooltipContent {...tooltipContentProps}>
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return component;
    });
}

export {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipTrigger,
    withTooltip,
};
