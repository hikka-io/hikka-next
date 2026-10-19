import type { FC, ReactNode, Ref } from 'react';

import { cva } from 'class-variance-authority';
import { Pressable, type PressableProps, View } from 'react-native';

import { cn } from '@/utils/cn';

import { IconClassContext } from './icon';
import { TextClassContext, wrapText } from './text';
import { DENSE_MAX_FONT_SCALE } from './typography';

const chipVariants = cva(
    'h-8 shrink-0 flex-row items-center gap-1.5 self-start rounded-md px-3',
    {
        variants: {
            interactive: {
                true: 'active:opacity-70',
                false: '',
            },
        },
        defaultVariants: {
            interactive: true,
        },
    },
);

const CHIP_HIT_SLOP = 6;

type Props = Omit<PressableProps, 'children'> & {
    ref?: Ref<View>;
    className?: string;
    textClassName?: string;
    children?: ReactNode;
};

const Chip: FC<Props> = ({
    ref,
    className,
    textClassName,
    children,
    onPress,
    ...props
}) => {
    const interactive = Boolean(onPress);
    const content = wrapText(children, {
        maxFontSizeMultiplier: DENSE_MAX_FONT_SCALE,
    });

    return (
        <TextClassContext.Provider
            value={cn('font-medium text-xs', textClassName)}
        >
            <IconClassContext.Provider value="size-4">
                {interactive ? (
                    <Pressable
                        ref={ref}
                        accessibilityRole="button"
                        hitSlop={CHIP_HIT_SLOP}
                        onPress={onPress}
                        className={cn(chipVariants({ interactive }), className)}
                        {...props}
                    >
                        {content}
                    </Pressable>
                ) : (
                    <View
                        ref={ref}
                        className={cn(chipVariants({ interactive }), className)}
                    >
                        {content}
                    </View>
                )}
            </IconClassContext.Provider>
        </TextClassContext.Provider>
    );
};

export { Chip, chipVariants };
