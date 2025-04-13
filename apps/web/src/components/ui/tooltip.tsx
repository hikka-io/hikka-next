'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '../../utils/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
    React.ComponentRef<typeof TooltipPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
            'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
        )}
        {...props}
    />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

function withTooltip<
    T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
>(Component: T) {
    return React.forwardRef<
        React.ComponentRef<T>,
        {
            tooltip?: React.ReactNode;
            tooltipContentProps?: Omit<
                React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
                'children'
            >;
            tooltipProps?: Omit<
                React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
                'children'
            >;
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
                    <TooltipTrigger asChild>{component}</TooltipTrigger>

                    <TooltipPortal>
                        <TooltipContent {...tooltipContentProps}>
                            {tooltip}
                        </TooltipContent>
                    </TooltipPortal>
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
