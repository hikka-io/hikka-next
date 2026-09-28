import * as React from 'react';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    type DropdownMenuRadioGroup,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';

export function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
    return (
        <ToolbarPrimitive.Root
            className={cn('relative flex select-none items-center', className)}
            {...props}
        />
    );
}

const toolbarButtonVariants = cva(
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-hidden hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-pressed:bg-muted aria-pressed:text-accent-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        defaultVariants: {
            size: 'default',
            variant: 'default',
        },
        variants: {
            size: {
                default: 'h-9 min-w-9 px-2',
                lg: 'h-10 min-w-10 px-2.5',
                sm: 'h-8 min-w-8 px-1.5',
            },
            variant: {
                default: 'bg-transparent',
                outline:
                    'border border bg-transparent shadow-xs hover:bg-muted hover:text-foreground',
            },
        },
    },
);

type ToolbarButtonProps = {
    isDropdown?: boolean;
    pressed?: boolean;
} & Omit<ToolbarPrimitive.Button.Props, 'value'> &
    VariantProps<typeof toolbarButtonVariants>;

export const ToolbarButton = withTooltip(function ToolbarButton({
    children,
    className,
    isDropdown,
    pressed,
    size = 'sm',
    variant,
    ...props
}: ToolbarButtonProps) {
    return typeof pressed === 'boolean' ? (
        <ToolbarToggleItem
            className={cn(
                toolbarButtonVariants({
                    size,
                    variant,
                }),
                isDropdown && 'justify-between gap-1 pr-1',
                className,
            )}
            pressed={pressed}
            {...(props as TogglePrimitive.Props)}
        >
            {isDropdown ? (
                <>
                    <div className="flex flex-1 items-center gap-2 whitespace-nowrap">
                        {children}
                    </div>
                    <div>
                        <ChevronDown
                            className="size-4 text-muted-foreground"
                            data-icon
                        />
                    </div>
                </>
            ) : (
                children
            )}
        </ToolbarToggleItem>
    ) : (
        <ToolbarPrimitive.Button
            className={cn(
                toolbarButtonVariants({
                    size,
                    variant,
                }),
                isDropdown && 'pr-1',
                className,
            )}
            {...props}
        >
            {children}
        </ToolbarPrimitive.Button>
    );
});

export function ToolbarToggleItem({
    className,
    size = 'sm',
    variant,
    ...props
}: TogglePrimitive.Props & VariantProps<typeof toolbarButtonVariants>) {
    return (
        <TogglePrimitive
            className={cn(toolbarButtonVariants({ size, variant }), className)}
            {...props}
        />
    );
}

export function ToolbarGroup({
    children,
    className,
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'group/toolbar-group',
                'relative hidden has-[button]:flex',
                className,
            )}
        >
            <div className="flex items-center">{children}</div>

            <div className="group-last/toolbar-group:hidden! mx-1.5 py-0.5">
                <Separator orientation="vertical" />
            </div>
        </div>
    );
}

type TooltipProps<T extends React.ElementType> = {
    tooltip?: React.ReactNode;
    tooltipContentProps?: Omit<
        React.ComponentPropsWithoutRef<typeof TooltipContent>,
        'children'
    >;
    tooltipProps?: Omit<
        React.ComponentPropsWithoutRef<typeof Tooltip>,
        'children'
    >;
    tooltipTriggerProps?: React.ComponentPropsWithoutRef<typeof TooltipTrigger>;
} & React.ComponentProps<T>;

function withTooltip<T extends React.ElementType>(Component: T) {
    return function ExtendComponent({
        tooltip,
        tooltipContentProps,
        tooltipProps,
        tooltipTriggerProps,
        ...props
    }: TooltipProps<T>) {
        const [mounted, setMounted] = React.useState(false);

        React.useEffect(() => {
            setMounted(true);
        }, []);

        const component = <Component {...(props as React.ComponentProps<T>)} />;

        if (tooltip && mounted) {
            return (
                <Tooltip {...tooltipProps}>
                    <TooltipTrigger
                        render={component}
                        {...tooltipTriggerProps}
                    />

                    <TooltipContent {...tooltipContentProps}>
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return component;
    };
}

export function ToolbarMenuGroup({
    children,
    className,
    label,
    ...props
}: React.ComponentProps<typeof DropdownMenuGroup> & { label?: string }) {
    return (
        <>
            <DropdownMenuSeparator
                className={cn(
                    'hidden',
                    'mb-0 shrink-0 peer-has-[[role=menuitem]]/menu-group:block peer-has-[[role=menuitemradio]]/menu-group:block peer-has-[[role=option]]/menu-group:block',
                )}
            />

            <DropdownMenuGroup
                {...props}
                className={cn(
                    'hidden',
                    'peer/menu-group group/menu-group has-[[role=menuitem]]:block has-[[role=menuitemradio]]:block has-[[role=option]]:block',
                    className,
                )}
            >
                {label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
                {children}
            </DropdownMenuGroup>
        </>
    );
}
