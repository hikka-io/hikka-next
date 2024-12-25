import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/utils';

const badgeVariants = cva(
    'inline-flex truncate items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary/20 text-card-foreground hover:bg-secondary/20/80',
                accent: 'border-transparent bg-accent text-accent-foreground hover:bg-accent/80',
                success:
                    'border-transparent bg-success text-success-foreground hover:bg-success/80',
                warning:
                    'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
                status: 'border-transparent text-white rounded-sm text-sm font-medium px-1.5 py-0',
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
