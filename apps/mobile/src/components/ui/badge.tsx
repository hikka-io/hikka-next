import type { FC, ReactNode } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

import { IconClassContext } from './icon';
import { TextClassContext, wrapText } from './text';
import { DENSE_MAX_FONT_SCALE } from './typography';

const badgeVariants = cva(
    'shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden rounded-sm border border-transparent px-2 py-0.5',
    {
        variants: {
            variant: {
                default: 'border-primary-border bg-primary',
                secondary: 'border-border bg-secondary',
                success: 'border-success-border bg-success',
                warning: 'border-warning-border bg-warning',
                destructive: 'border-destructive-border bg-destructive',
                outline: 'border-border',
                status: 'px-1.5 py-0',
            },
            status: {
                watching: 'border-watching-border bg-watching',
                reading: 'border-reading-border bg-reading',
                planned: 'border-planned-border bg-planned',
                completed: 'border-completed-border bg-completed',
                on_hold: 'border-on_hold-border bg-on_hold',
                dropped: 'border-dropped-border bg-dropped',
                ongoing: 'border-ongoing-border bg-ongoing',
                finished: 'border-finished-border bg-finished',
                announced: 'border-announced-border bg-announced',
                discontinued: 'border-discontinued-border bg-discontinued',
                paused: 'border-paused-border bg-paused',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const badgeTextVariants = cva('font-medium text-xs', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            secondary: 'text-secondary-foreground',
            success: 'text-success-foreground',
            warning: 'text-warning-foreground',
            destructive: 'text-destructive-foreground',
            outline: 'text-foreground',
            status: '',
        },
        status: {
            watching: 'text-watching-foreground',
            reading: 'text-reading-foreground',
            planned: 'text-planned-foreground',
            completed: 'text-completed-foreground',
            on_hold: 'text-on_hold-foreground',
            dropped: 'text-dropped-foreground',
            ongoing: 'text-ongoing-foreground',
            finished: 'text-finished-foreground',
            announced: 'text-announced-foreground',
            discontinued: 'text-discontinued-foreground',
            paused: 'text-paused-foreground',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type Props = ViewProps &
    VariantProps<typeof badgeVariants> & {
        textClassName?: string;
        children?: ReactNode;
    };

const Badge: FC<Props> = ({
    className,
    textClassName,
    variant,
    status,
    children,
    ...props
}) => {
    return (
        <TextClassContext.Provider
            value={cn(badgeTextVariants({ variant, status }), textClassName)}
        >
            <IconClassContext.Provider value="size-3">
                <View
                    className={cn(
                        badgeVariants({ variant, status }),
                        className,
                    )}
                    {...props}
                >
                    {wrapText(children, {
                        maxFontSizeMultiplier: DENSE_MAX_FONT_SCALE,
                    })}
                </View>
            </IconClassContext.Provider>
        </TextClassContext.Provider>
    );
};

export { Badge, badgeVariants };
