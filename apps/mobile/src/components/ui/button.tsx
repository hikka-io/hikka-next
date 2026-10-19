import type { FC, ReactNode, Ref } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable, type PressableProps, type View } from 'react-native';

import { cn } from '@/utils/cn';

import { IconClassContext } from './icon';
import { TextClassContext, wrapText } from './text';

const buttonVariants = cva(
    'shrink-0 flex-row items-center justify-center gap-2 rounded-lg disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'border border-primary-border bg-primary active:bg-primary-border',
                destructive:
                    'border border-destructive-border bg-destructive active:bg-destructive-border',
                success:
                    'border border-success-border bg-success active:bg-success-border',
                info: 'bg-info active:opacity-90',
                warning:
                    'border border-warning-border bg-warning active:bg-warning-border',
                outline:
                    'border border-border bg-background active:bg-accent dark:border-input dark:bg-input/30 dark:active:bg-input/50',
                secondary: 'bg-secondary active:bg-secondary/80',
                ghost: 'active:bg-accent dark:active:bg-accent/50',
                link: 'active:opacity-70',
            },
            size: {
                default: 'h-12 px-4 py-2',
                sm: 'h-8 px-2 py-1',
                md: 'h-10 rounded-md px-3 py-2',
                lg: 'h-13 rounded-md px-8',
                icon: 'size-12',
                'icon-md': 'size-10',
                'icon-sm': 'size-8',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

const buttonTextVariants = cva('font-medium text-sm', {
    variants: {
        variant: {
            default: 'text-primary-foreground',
            destructive: 'text-destructive-foreground',
            success: 'text-success-foreground',
            info: 'text-info-foreground',
            warning: 'text-warning-foreground',
            outline: 'text-foreground',
            secondary: 'text-secondary-foreground',
            ghost: 'text-foreground',
            link: 'text-primary-foreground',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

const MIN_HIT_SIZE = 44;

const BUTTON_HEIGHTS: Record<ButtonSize, number> = {
    default: 48,
    sm: 32,
    md: 40,
    lg: 52,
    icon: 48,
    'icon-md': 40,
    'icon-sm': 32,
};

function hitSlopFor(size: ButtonSize) {
    const inset = Math.max(0, (MIN_HIT_SIZE - BUTTON_HEIGHTS[size]) / 2);
    return inset > 0 ? inset : undefined;
}

type Props = Omit<PressableProps, 'children'> &
    VariantProps<typeof buttonVariants> & {
        ref?: Ref<View>;
        className?: string;
        textClassName?: string;
        children?: ReactNode;
    };

const Button: FC<Props> = ({
    className,
    textClassName,
    variant,
    size,
    children,
    ...props
}) => {
    return (
        <TextClassContext.Provider
            value={cn(buttonTextVariants({ variant }), textClassName)}
        >
            <IconClassContext.Provider value="size-4">
                <Pressable
                    accessibilityRole="button"
                    hitSlop={hitSlopFor(size ?? 'default')}
                    className={cn(buttonVariants({ variant, size }), className)}
                    {...props}
                >
                    {wrapText(children)}
                </Pressable>
            </IconClassContext.Provider>
        </TextClassContext.Provider>
    );
};

export { Button, buttonTextVariants, buttonVariants };
