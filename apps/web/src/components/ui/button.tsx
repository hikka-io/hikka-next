import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
    'inline-flex gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50',
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
                    'bg-secondary/20 border border-border hover:bg-secondary hover:text-secondary-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                ghost: 'hover:bg-secondary/60 hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0',
                link: 'text-primary-foreground underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-12 px-4 py-2',
                sm: 'h-8 px-2 py-1',
                md: 'h-10 rounded-md px-3',
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
