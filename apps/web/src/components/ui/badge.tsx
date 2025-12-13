import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/cn';

const badgeVariants = cva(
    'inline-flex truncate items-center rounded-sm border px-1.5 py-0 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground border border-primary-border hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                success:
                    'border-transparent bg-success text-success-foreground border border-success-border hover:bg-success/80',
                warning:
                    'border-transparent bg-warning text-warning-foreground border border-warning-border hover:bg-warning/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground border border-destructive-border hover:bg-destructive/80',
                outline: 'text-foreground',
                status: 'border-transparent text-white rounded-sm px-1.5 py-0',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
    bgColor?: string;
}

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
