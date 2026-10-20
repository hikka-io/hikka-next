import { type FC, useEffect } from 'react';

import { View, type ViewProps } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { useResolveClassNames } from 'uniwind';

import { cn } from '@/utils/cn';

const PULSE_DURATION = 1000;
const PULSE_EASING = Easing.bezier(0.4, 0, 0.6, 1);

type SkeletonProps = ViewProps;

const Skeleton: FC<SkeletonProps> = ({ className, style, ...props }) => {
    const opacity = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.5, { duration: PULSE_DURATION, easing: PULSE_EASING }),
            -1,
            true,
        );

        return () => cancelAnimation(opacity);
    }, [opacity]);

    const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View
            className={cn('rounded-md bg-secondary/20', className)}
            style={[pulse, style]}
            {...props}
        />
    );
};

type SkeletonTextProps = ViewProps & {
    barClassName?: string;
    lines?: number;
};

const SkeletonText: FC<SkeletonTextProps> = ({
    className,
    barClassName,
    lines = 1,
    ...props
}) => {
    const { fontSize, lineHeight } = useResolveClassNames(
        cn('text-base', className),
    );
    const { height: barOverride } = useResolveClassNames(barClassName ?? '');
    const fontBar = typeof fontSize === 'number' ? fontSize : 16;
    const barHeight = typeof barOverride === 'number' ? barOverride : fontBar;
    const rowHeight =
        typeof lineHeight === 'number' ? lineHeight : fontBar * 1.5;

    return (
        <View className={cn('flex-col', className)} {...props}>
            {Array.from({ length: lines }, (_, index) => (
                <View
                    key={index}
                    className="justify-center"
                    style={{ height: rowHeight }}
                >
                    <Skeleton
                        style={{ height: barHeight }}
                        className={cn(
                            'w-full',
                            barClassName,
                            lines > 1 && index === lines - 1 && 'w-2/3',
                        )}
                    />
                </View>
            ))}
        </View>
    );
};

export { Skeleton, SkeletonText };
