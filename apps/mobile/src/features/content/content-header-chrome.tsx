import { type FC, useEffect, useState } from 'react';

import { Stack } from 'expo-router';
import { unstable_getMaterialSymbolSourceAsync } from 'expo-symbols';
import { type ImageSourcePropType, Platform, Share } from 'react-native';

import type { MainContentTypeEnum } from '@hikka/api';

import { contentWebUrl } from './content-href';

const ANDROID_ICON_SIZE = 24;

const useAndroidShareIcon = () => {
    const [icon, setIcon] = useState<ImageSourcePropType | null>(null);

    useEffect(() => {
        if (Platform.OS !== 'android') return;
        // The toolbar tints template icons itself; the render color is irrelevant.
        void unstable_getMaterialSymbolSourceAsync(
            'share',
            ANDROID_ICON_SIZE,
            'black',
        ).then(setIcon);
    }, []);

    return icon;
};

type Props = {
    contentType: MainContentTypeEnum;
    slug: string;
    title: string;
    titleVisible: boolean;
    shareable: boolean;
};

const ContentHeaderChrome: FC<Props> = ({
    contentType,
    slug,
    title,
    titleVisible,
    shareable,
}) => {
    const androidIcon = useAndroidShareIcon();
    const url = contentWebUrl(contentType, slug);
    const icon =
        Platform.OS === 'android' ? androidIcon : 'square.and.arrow.up';

    const share = () =>
        Share.share(Platform.OS === 'ios' ? { url } : { title, message: url });

    return (
        <>
            <Stack.Title>{titleVisible ? title : ''}</Stack.Title>
            {icon && shareable && (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Button
                        icon={icon}
                        accessibilityLabel="Поділитися"
                        onPress={share}
                    />
                </Stack.Toolbar>
            )}
        </>
    );
};

export default ContentHeaderChrome;
