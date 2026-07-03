import type * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const badgeVariants = cva(
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border border-transparent px-2 py-0.5 font-medium text-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3',
    {
        variants: {
            variant: {
                default:
                    'border-primary-border bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
                secondary:
                    'border-border bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
                success:
                    'border-success-border bg-success text-success-foreground [a&]:hover:bg-success/90',
                warning:
                    'border-warning-border bg-warning text-warning-foreground [a&]:hover:bg-warning/90',
                destructive:
                    'border-destructive-border bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90',
                outline:
                    'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
                status: 'rounded-sm border-transparent px-1.5 py-0 text-white',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof badgeVariants> & {
        bgColor?: string;
    };

function Badge({ className, variant, bgColor, ...props }: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant }), className)}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
