import { type FC, useCallback, useState } from 'react';

import { X } from 'lucide-react-native';
import {
    AccessibilityInfo,
    FlatList,
    Modal,
    Pressable,
    StatusBar,
    useWindowDimensions,
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { sizedImageUrl } from '@/utils/image-presets';

import { useImageViewerStore } from './image-viewer-store';
import ZoomableImage from './zoomable-image';

// Zoom needs more pixels than the screen shows; imgproxy never enlarges, and both sides are bounded so no screen downloads an original.
const ZOOM_SOURCE_FACTOR = 2;
const MAX_SOURCE_POINTS = 1000;
const DEFAULT_LABEL = 'Зображення';

const ImageViewerHost: FC = () => {
    const urls = useImageViewerStore((state) => state.urls);
    const initial = useImageViewerStore((state) => state.index);
    const alt = useImageViewerStore((state) => state.alt);
    const close = useImageViewerStore((state) => state.close);
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const backdrop = useSharedValue(1);
    const [zoomed, setZoomed] = useState(false);
    const [page, setPage] = useState<number | null>(null);

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: backdrop.value,
    }));

    const dismiss = useCallback(() => {
        setZoomed(false);
        setPage(null);
        backdrop.value = 1;
        close();
    }, [backdrop, close]);

    const visible = urls.length > 0;
    const current = page ?? initial;
    const counter = `${current + 1} / ${urls.length}`;

    const imageLabel = (position: number) => {
        const name = alt ?? DEFAULT_LABEL;

        return urls.length > 1
            ? `${name}, ${position + 1} / ${urls.length}`
            : name;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={dismiss}
        >
            <GestureHandlerRootView
                accessibilityViewIsModal
                onAccessibilityEscape={dismiss}
                style={{ flex: 1 }}
            >
                <Animated.View
                    style={backdropStyle}
                    className="absolute inset-0 bg-black"
                />
                {visible && (
                    <FlatList
                        data={urls}
                        horizontal
                        pagingEnabled
                        scrollEnabled={!zoomed && urls.length > 1}
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={initial}
                        getItemLayout={(_, position) => ({
                            length: width,
                            offset: width * position,
                            index: position,
                        })}
                        keyExtractor={(url, position) => `${position}:${url}`}
                        onMomentumScrollEnd={(event) => {
                            const next = Math.round(
                                event.nativeEvent.contentOffset.x / width,
                            );

                            setPage(next);
                            AccessibilityInfo.announceForAccessibility(
                                `${next + 1} / ${urls.length}`,
                            );
                        }}
                        renderItem={({ item, index }) => (
                            <ZoomableImage
                                uri={
                                    sizedImageUrl(
                                        item,
                                        Math.min(
                                            width * ZOOM_SOURCE_FACTOR,
                                            MAX_SOURCE_POINTS,
                                        ),
                                        Math.min(
                                            height * ZOOM_SOURCE_FACTOR,
                                            MAX_SOURCE_POINTS,
                                        ),
                                        'fit',
                                    ) ?? item
                                }
                                width={width}
                                height={height}
                                backdrop={backdrop}
                                label={imageLabel(index)}
                                onZoomChange={setZoomed}
                                onDismiss={dismiss}
                            />
                        )}
                    />
                )}
                <View
                    pointerEvents="box-none"
                    style={{ paddingTop: insets.top + 8 }}
                    className="absolute inset-x-0 top-0 flex-row items-center justify-between px-4"
                >
                    {urls.length > 1 ? (
                        <View
                            accessible
                            accessibilityLabel={counter}
                            className="h-10 justify-center rounded-full bg-white/20 px-3"
                        >
                            <Text className="text-sm text-white">
                                {counter}
                            </Text>
                        </View>
                    ) : (
                        <View />
                    )}
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Закрити"
                        onPress={dismiss}
                        className="size-11 items-center justify-center rounded-full bg-white/20 active:opacity-70"
                    >
                        <Icon as={X} className="size-5 text-white" />
                    </Pressable>
                </View>
            </GestureHandlerRootView>
            {visible && <StatusBar barStyle="light-content" />}
        </Modal>
    );
};

export default ImageViewerHost;
