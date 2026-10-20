import type { FC, ReactNode, Ref } from 'react';

import { cva } from 'class-variance-authority';
import { type PressableProps, View } from 'react-native';

import { cn } from '@/utils/cn';

import { IconClassContext } from './icon';
import { TextClassContext, wrapText } from './text';
import TouchTarget from './touch-target';
import { DENSE_MAX_FONT_SCALE } from './typography';

const chipVariants = cva(
    'h-8 shrink-0 flex-row items-center gap-1.5 self-start rounded-md px-3',
    {
        variants: {
            selected: {
                true: 'border border-primary-border bg-primary',
                false: '',
            },
        },
        defaultVariants: {
            selected: false,
        },
    },
);

type Props = Omit<PressableProps, 'children' | 'className'> & {
    ref?: Ref<View>;
    selected?: boolean;
    className?: string;
    containerClassName?: string;
    textClassName?: string;
    children?: ReactNode;
};

const Chip: FC<Props> = ({
    ref,
    selected = false,
    className,
    containerClassName,
    textClassName,
    children,
    onPress,
    accessibilityState,
    ...props
}) => {
    const visual = cn(chipVariants({ selected }), className);
    const content = wrapText(children, {
        maxFontSizeMultiplier: DENSE_MAX_FONT_SCALE,
    });

    return (
        <TextClassContext.Provider
            value={cn(
                'font-medium text-xs',
                selected && 'text-primary-foreground',
                textClassName,
            )}
        >
            <IconClassContext.Provider value="size-4">
                {onPress ? (
                    <TouchTarget
                        ref={ref}
                        accessibilityRole="button"
                        accessibilityState={{ ...accessibilityState, selected }}
                        onPress={onPress}
                        containerClassName={containerClassName}
                        className={visual}
                        pressedClassName="opacity-70"
                        {...props}
                    >
                        {content}
                    </TouchTarget>
                ) : (
                    <View ref={ref} className={visual}>
                        {content}
                    </View>
                )}
            </IconClassContext.Provider>
        </TextClassContext.Provider>
    );
};

export { Chip, chipVariants };
