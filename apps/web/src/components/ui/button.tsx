import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground border border-primary-border hover:bg-primary-border',
                destructive:
                    'bg-destructive text-destructive-foreground border border-destructive-border hover:bg-destructive-border',
                success:
                    'bg-success text-success-foreground border border-success-border hover:bg-success-border',
                info: 'bg-info text-info-foreground hover:bg-info/90',
                warning:
                    'bg-warning text-warning-foreground border border-warning-border hover:bg-warning-border',
                outline:
                    'border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
                link: 'text-primary-foreground underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-12 px-4 py-2',
                xs: 'h-6 px-2 py-1 text-xs',
                sm: 'h-8 px-2 py-1',
                md: 'h-10 rounded-md px-3 py-2',
                lg: 'h-13 rounded-md px-8',
                badge: 'px-3.5 py-1 text-xs rounded-full',
                icon: 'h-12 w-12',
                'icon-md': 'h-10 w-10',
                'icon-sm': 'h-8 w-8',
                'icon-xs': 'h-6 w-6',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            type = 'button',
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? SlotPrimitive.Slot : 'button';
        return (
            <Comp
                type={asChild ? undefined : type}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
