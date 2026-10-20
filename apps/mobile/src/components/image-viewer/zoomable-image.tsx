import { type FC, useState } from 'react';

import { ActivityIndicator, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    type SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import Image from '@/components/ui/image';

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;
const MOVE_SLOP = 10;
const ZOOMED_SCALE = 1.01;

const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
};

type Props = {
    uri: string;
    width: number;
    height: number;
    // 1 while the image rests, 0 when dragged a full screen away: drives the backdrop.
    backdrop: SharedValue<number>;
    label: string;
    onZoomChange: (zoomed: boolean) => void;
    onDismiss: () => void;
};

const ZoomableImage: FC<Props> = ({
    uri,
    width,
    height,
    backdrop,
    label,
    onZoomChange,
    onDismiss,
}) => {
    const [ratio, setRatio] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const scale = useSharedValue(1);
    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const startScale = useSharedValue(1);
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);
    const focalX = useSharedValue(0);
    const focalY = useSharedValue(0);
    const touchX = useSharedValue(0);
    const touchY = useSharedValue(0);

    // The image is laid out `contain` inside the page, so the pan limits follow its fitted size.
    const fitted = ratio
        ? ratio > width / height
            ? { w: width, h: width / ratio }
            : { w: height * ratio, h: height }
        : { w: width, h: height };

    const limitX = (s: number) => {
        'worklet';
        return Math.max(0, (fitted.w * s - width) / 2);
    };
    const limitY = (s: number) => {
        'worklet';
        return Math.max(0, (fitted.h * s - height) / 2);
    };

    const settle = () => {
        'worklet';
        const next = clamp(scale.value, 1, MAX_SCALE);
        scale.value = withSpring(next);
        x.value = withSpring(clamp(x.value, -limitX(next), limitX(next)));
        y.value = withSpring(clamp(y.value, -limitY(next), limitY(next)));
        scheduleOnRN(onZoomChange, next > 1);
    };

    const pinch = Gesture.Pinch()
        .onStart((event) => {
            startScale.value = scale.value;
            startX.value = x.value;
            startY.value = y.value;
            focalX.value = event.focalX - width / 2;
            focalY.value = event.focalY - height / 2;
        })
        .onUpdate((event) => {
            const next = clamp(
                startScale.value * event.scale,
                0.6,
                MAX_SCALE * 1.5,
            );
            const grow = next / startScale.value;
            // The point under the fingers stays fixed while scaling about the page centre.
            x.value =
                event.focalX - width / 2 - (focalX.value - startX.value) * grow;
            y.value =
                event.focalY -
                height / 2 -
                (focalY.value - startY.value) * grow;
            scale.value = next;
        })
        .onEnd(settle);

    const pan = Gesture.Pan()
        .manualActivation(true)
        .onTouchesDown((event) => {
            touchX.value = event.allTouches[0]?.absoluteX ?? 0;
            touchY.value = event.allTouches[0]?.absoluteY ?? 0;
        })
        .onTouchesMove((event, manager) => {
            const touch = event.allTouches[0];
            if (!touch || event.numberOfTouches > 1) return;

            if (scale.value > ZOOMED_SCALE) {
                manager.activate();
                return;
            }

            // At rest only a mostly vertical drag is ours (dismiss); a horizontal one pages the gallery.
            const dx = Math.abs(touch.absoluteX - touchX.value);
            const dy = Math.abs(touch.absoluteY - touchY.value);

            if (dy > MOVE_SLOP && dy > dx) manager.activate();
            else if (dx > MOVE_SLOP) manager.fail();
        })
        .onStart(() => {
            startX.value = x.value;
            startY.value = y.value;
        })
        .onUpdate((event) => {
            x.value = startX.value + event.translationX;
            y.value = startY.value + event.translationY;

            if (scale.value <= ZOOMED_SCALE) {
                backdrop.value = 1 - clamp(Math.abs(y.value) / height, 0, 1);
            }
        })
        .onEnd((event) => {
            if (scale.value > ZOOMED_SCALE) {
                settle();
                return;
            }

            if (
                Math.abs(y.value) > DISMISS_DISTANCE ||
                Math.abs(event.velocityY) > DISMISS_VELOCITY
            ) {
                scheduleOnRN(onDismiss);
                return;
            }

            x.value = withSpring(0);
            y.value = withSpring(0);
            backdrop.value = withTiming(1);
        });

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .maxDuration(250)
        .onEnd((event) => {
            const zoomIn = scale.value <= ZOOMED_SCALE;
            const next = zoomIn ? DOUBLE_TAP_SCALE : 1;
            const tapX = event.x - width / 2;
            const tapY = event.y - height / 2;

            scale.value = withSpring(next);
            x.value = withSpring(
                zoomIn
                    ? clamp(-tapX * (next - 1), -limitX(next), limitX(next))
                    : 0,
            );
            y.value = withSpring(
                zoomIn
                    ? clamp(-tapY * (next - 1), -limitY(next), limitY(next))
                    : 0,
            );
            scheduleOnRN(onZoomChange, zoomIn);
        });

    const gesture = Gesture.Exclusive(
        doubleTap,
        Gesture.Simultaneous(pinch, pan),
    );

    const style = useAnimatedStyle(() => ({
        transform: [
            { translateX: x.value },
            { translateY: y.value },
            { scale: scale.value },
        ],
    }));

    return (
        <GestureDetector gesture={gesture}>
            <View
                accessible
                accessibilityRole="image"
                accessibilityLabel={label}
                style={{ width, height }}
                className="items-center justify-center"
            >
                {loading && (
                    <View className="absolute">
                        <ActivityIndicator color="white" />
                    </View>
                )}
                <Animated.View style={[{ width, height }, style]}>
                    <Image
                        source={uri}
                        contentFit="contain"
                        allowDownscaling={false}
                        accessibilityIgnoresInvertColors
                        style={{ width, height }}
                        onLoad={({ source }) => {
                            setLoading(false);
                            if (source.width > 0 && source.height > 0) {
                                setRatio(source.width / source.height);
                            }
                        }}
                        onError={() => setLoading(false)}
                    />
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

export default ZoomableImage;
