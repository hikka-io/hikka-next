import type { FC } from 'react';

import { useRecyclingState } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { sizedImageUrl } from '@/utils/image-presets';

import { resolveImageUrl } from './links';
import { useOpenLink } from './use-open-link';

// The widest phone screen, in points.
const MAX_WIDTH = 440;

type Props = {
    uri: string;
    alt?: string;
    href?: string;
};

const MDImage: FC<Props> = ({ uri, alt, href }) => {
    const openLink = useOpenLink();
    const source = resolveImageUrl(uri);
    const [ratio, setRatio] = useRecyclingState<number | null>(null, [source]);

    if (!source) return null;

    const image = (
        <View
            className="overflow-hidden rounded-lg bg-muted"
            style={{ aspectRatio: ratio ?? 16 / 9 }}
        >
            <Image
                source={sizedImageUrl(source, MAX_WIDTH)}
                recyclingKey={source}
                accessibilityLabel={alt}
                style={{ width: '100%', height: '100%' }}
                contentFit="contain"
                onLoad={({ source }) => {
                    if (source.width > 0 && source.height > 0) {
                        setRatio(source.width / source.height);
                    }
                }}
            />
        </View>
    );

    return href ? (
        <Pressable accessibilityRole="link" onPress={() => openLink(href)}>
            {image}
        </Pressable>
    ) : (
        image
    );
};

export default MDImage;
