import type { FC } from 'react';
import { useState } from 'react';

import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { resolveImageUrl } from './links';
import { useOpenLink } from './use-open-link';

type Props = {
    uri: string;
    alt?: string;
    href?: string;
};

const MDImage: FC<Props> = ({ uri, alt, href }) => {
    const openLink = useOpenLink();
    const [ratio, setRatio] = useState<number | null>(null);

    const source = resolveImageUrl(uri);

    if (!source) return null;

    const image = (
        <View
            className="overflow-hidden rounded-lg bg-muted"
            style={{ aspectRatio: ratio ?? 16 / 9 }}
        >
            <Image
                source={source}
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
