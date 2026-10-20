import { type FC, type ReactNode, useEffect, useState } from 'react';

import { Stack } from 'expo-router';
import { unstable_getMaterialSymbolSourceAsync } from 'expo-symbols';
import { type ImageSourcePropType, Platform } from 'react-native';

import { shareSitePath } from '@/utils/share';

const ANDROID_ICON_SIZE = 24;
// Bundled Material `share` glyph, used when the symbol cannot be rendered.
const shareIcon: ImageSourcePropType = require('../../assets/images/share.png');

// Compose toolbar items take image sources only, so the Material symbol is rendered to one.
const useAndroidShareIcon = () => {
    const [icon, setIcon] = useState<ImageSourcePropType | null>(null);

    useEffect(() => {
        if (Platform.OS !== 'android') return;
        // The toolbar tints template icons itself; the render color is irrelevant.
        void unstable_getMaterialSymbolSourceAsync(
            'share',
            ANDROID_ICON_SIZE,
            'black',
        )
            .then((source) => setIcon(source ?? shareIcon))
            .catch(() => setIcon(shareIcon));
    }, []);

    return icon;
};

type Props = {
    title: string;
    // Detail pages start with an empty title and show it once the hero title scrolls under the bar.
    titleVisible?: boolean;
    // The hikka.io path to share; the share action shows only once it is known.
    sharePath?: string;
    // Page actions placed before share: a screen holds one right toolbar, so a second one would replace it.
    actions?: ReactNode;
};

const DetailHeaderChrome: FC<Props> = ({
    title,
    titleVisible = true,
    sharePath,
    actions,
}) => {
    const androidIcon = useAndroidShareIcon();
    const icon =
        Platform.OS === 'android' ? androidIcon : 'square.and.arrow.up';

    return (
        <>
            <Stack.Title>{titleVisible ? title : ''}</Stack.Title>
            {((icon && sharePath) || actions) && (
                <Stack.Toolbar placement="right">
                    {actions}
                    {icon && sharePath ? (
                        <Stack.Toolbar.Button
                            icon={icon}
                            accessibilityLabel="Поділитися"
                            onPress={() => shareSitePath(sharePath, title)}
                        />
                    ) : null}
                </Stack.Toolbar>
            )}
        </>
    );
};

export default DetailHeaderChrome;
