import type { FC, ReactNode, Ref } from 'react';

import { Pressable, type PressableProps, View } from 'react-native';

import { cn } from '@/utils/cn';

type Props = Omit<PressableProps, 'children' | 'className'> & {
    ref?: Ref<View>;
    className?: string;
    containerClassName?: string;
    pressedClassName?: string;
    children?: ReactNode;
};

// A 44 pt layout box around a smaller visual: hitSlop cannot reach past the parent's bounds on Android.
const TouchTarget: FC<Props> = ({
    ref,
    className,
    containerClassName,
    pressedClassName,
    disabled,
    children,
    ...props
}) => {
    return (
        <Pressable
            ref={ref}
            disabled={disabled}
            className={cn(
                'min-h-11 min-w-11 items-center justify-center',
                containerClassName,
            )}
            {...props}
        >
            {({ pressed }) => (
                <View
                    className={cn(
                        className,
                        pressed && pressedClassName,
                        disabled && 'opacity-50',
                    )}
                >
                    {children}
                </View>
            )}
        </Pressable>
    );
};

export default TouchTarget;
