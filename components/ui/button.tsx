import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/utils';


const buttonVariants = cva(
    'inline-flex gap-2 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'border border-primary bg-primary text-primary-foreground hover:bg-primary/90',
                destructive:
                    'border border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90',
                success:
                    'border border-success bg-success text-success-foreground hover:bg-success/90',
                info:
                    'border border-info bg-info text-info-foreground hover:bg-info/90',
                warning:
                    'border border-warning bg-warning text-warning-foreground hover:bg-warning/90',
                outline:
                    'border border-secondary/60 hover:bg-secondary/30 hover:text-secondary-foreground',
                secondary:
                    'border border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80',
                accent:
                    'border border-accent bg-accent text-accent-foreground hover:bg-accent/80',
                ghost: 'hover:bg-secondary/60 hover:text-accent-foreground focus-visible:ring-0 focus-visible:ring-offset-0',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-12 px-4 py-2',
                sm: 'h-10 rounded-md px-3',
                lg: 'h-13 rounded-md px-8',
                badge: 'px-3.5 py-1 text-xs rounded-full',
                icon: 'h-12 w-12',
                "icon-md": 'h-10 w-10',
                "icon-sm": 'h-8 w-8',
                "icon-xs": 'h-6 w-6'
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };