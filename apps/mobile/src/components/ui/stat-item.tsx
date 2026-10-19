import type { FC, ReactNode, Ref } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import {
    Pressable,
    type PressableProps,
    View,
    type ViewProps,
} from 'react-native';

import { cn } from '@/utils/cn';

import { IconClassContext } from './icon';
import { TextClassContext, wrapText } from './text';
import { DENSE_MAX_FONT_SCALE } from './typography';

const statItemVariants = cva('flex-row items-center', {
    variants: {
        size: {
            default: 'h-8 gap-1 rounded-lg px-2 active:bg-accent',
            sm: 'gap-1',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

const STAT_TEXT_SIZE = {
    default: 'text-sm text-muted-foreground',
    sm: 'text-xs text-muted-foreground',
} as const;

const STAT_ICON_SIZE = {
    default: 'size-4',
    sm: 'size-3',
} as const;

const STAT_HIT_SLOP = 6;

type StatItemProps = Omit<PressableProps, 'children'> &
    VariantProps<typeof statItemVariants> & {
        ref?: Ref<View>;
        className?: string;
        children?: ReactNode;
    };

const StatItem: FC<StatItemProps> = ({
    ref,
    className,
    size,
    children,
    onPress,
    ...props
}) => {
    const resolvedSize = size ?? 'default';
    const content = wrapText(children, {
        maxFontSizeMultiplier: DENSE_MAX_FONT_SCALE,
    });

    return (
        <TextClassContext.Provider value={STAT_TEXT_SIZE[resolvedSize]}>
            <IconClassContext.Provider value={STAT_ICON_SIZE[resolvedSize]}>
                {onPress ? (
                    <Pressable
                        ref={ref}
                        accessibilityRole="button"
                        hitSlop={STAT_HIT_SLOP}
                        onPress={onPress}
                        className={cn(statItemVariants({ size }), className)}
                        {...props}
                    >
                        {content}
                    </Pressable>
                ) : (
                    <View
                        ref={ref}
                        className={cn(statItemVariants({ size }), className)}
                    >
                        {content}
                    </View>
                )}
            </IconClassContext.Provider>
        </TextClassContext.Provider>
    );
};

const statItemGroupVariants = cva('flex-row items-center', {
    variants: {
        size: {
            default: 'gap-1',
            sm: 'gap-3',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

type StatItemGroupProps = ViewProps &
    VariantProps<typeof statItemGroupVariants>;

const StatItemGroup: FC<StatItemGroupProps> = ({
    className,
    size,
    ...props
}) => {
    return (
        <View
            className={cn(statItemGroupVariants({ size }), className)}
            {...props}
        />
    );
};

export { StatItem, StatItemGroup, statItemGroupVariants, statItemVariants };
