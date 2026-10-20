import type { FC, ReactNode, Ref } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import type { PressableProps, View } from 'react-native';

import { cn } from '@/utils/cn';

import { IconClassContext } from './icon';
import { TextClassContext, wrapText } from './text';
import TouchTarget from './touch-target';

const buttonVariants = cva(
    'shrink-0 flex-row items-center justify-center gap-2 rounded-lg',
    {
        variants: {
            variant: {
                default: 'border border-primary-border bg-primary',
                destructive: 'border border-destructive-border bg-destructive',
                success: 'border border-success-border bg-success',
                info: 'bg-info',
                warning: 'border border-warning-border bg-warning',
                outline:
                    'border border-border bg-background dark:border-input dark:bg-input/30',
                secondary: 'bg-secondary',
                ghost: '',
                link: '',
            },
            size: {
                default: 'min-h-12 px-4 py-2',
                sm: 'min-h-8 px-2 py-1',
                md: 'min-h-10 rounded-md px-3 py-2',
                lg: 'min-h-13 rounded-md px-8',
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

type ButtonVariant = NonNullable<
    VariantProps<typeof buttonVariants>['variant']
>;

const BUTTON_PRESSED: Record<ButtonVariant, string> = {
    default: 'bg-primary-border',
    destructive: 'bg-destructive-border',
    success: 'bg-success-border',
    info: 'opacity-90',
    warning: 'bg-warning-border',
    outline: 'bg-accent dark:bg-input/50',
    secondary: 'bg-secondary/80',
    ghost: 'bg-accent dark:bg-accent/50',
    link: 'opacity-70',
};

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

type BaseProps = Omit<PressableProps, 'children' | 'className'> & {
    ref?: Ref<View>;
    variant?: ButtonVariant | null;
    className?: string;
    containerClassName?: string;
    textClassName?: string;
    children?: ReactNode;
};

type IconSize = 'icon' | 'icon-md' | 'icon-sm';

type Props = BaseProps &
    (
        | { size: IconSize; accessibilityLabel: string }
        | { size?: Exclude<ButtonSize, IconSize> | null }
    );

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>['size']>;

const Button: FC<Props> = ({
    className,
    containerClassName,
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
                <TouchTarget
                    accessibilityRole="button"
                    containerClassName={containerClassName}
                    className={cn(buttonVariants({ variant, size }), className)}
                    pressedClassName={BUTTON_PRESSED[variant ?? 'default']}
                    {...props}
                >
                    {wrapText(children)}
                </TouchTarget>
            </IconClassContext.Provider>
        </TextClassContext.Provider>
    );
};

export { Button, buttonTextVariants, buttonVariants };
