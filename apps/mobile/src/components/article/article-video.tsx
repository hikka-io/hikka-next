import type { FC } from 'react';

import { openBrowserAsync } from 'expo-web-browser';
import { Play } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { getYouTubeThumbnail } from '@hikka/core';

import { Icon } from '@/components/ui/icon';
import Image from '@/components/ui/image';
import { Text } from '@/components/ui/text';

import { youTubeWatchUrl } from './document-layout';

const VIDEO_RATIO = 16 / 9;

type Props = {
    video: { id: string; start?: number } | null;
};

const ArticleVideo: FC<Props> = ({ video }) => {
    if (!video) {
        return (
            <View
                style={{ aspectRatio: VIDEO_RATIO }}
                className="items-center justify-center rounded-md bg-muted"
            >
                <Text className="text-muted-foreground text-sm">
                    Не вдалося показати відео
                </Text>
            </View>
        );
    }

    const thumbnail = getYouTubeThumbnail(video.id, 'high');

    return (
        <Pressable
            accessibilityRole="link"
            accessibilityLabel="Відео з YouTube"
            accessibilityHint="Дивитися"
            onPress={() =>
                void openBrowserAsync(youTubeWatchUrl(video.id, video.start))
            }
            style={{ aspectRatio: VIDEO_RATIO }}
            className="overflow-hidden rounded-md bg-muted active:opacity-70"
        >
            {thumbnail && (
                <Image
                    source={thumbnail}
                    recyclingKey={thumbnail}
                    contentFit="cover"
                    transition={150}
                    accessibilityIgnoresInvertColors
                    className="absolute inset-0 size-full"
                />
            )}
            <View className="absolute inset-0 items-center justify-center">
                <View className="h-12 w-16 items-center justify-center rounded-xl bg-black/70">
                    <Icon as={Play} className="size-6 text-white" />
                </View>
            </View>
        </Pressable>
    );
};

export default ArticleVideo;
