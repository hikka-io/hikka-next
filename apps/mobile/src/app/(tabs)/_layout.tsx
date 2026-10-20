import { useEffect, useState } from 'react';

import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Keyboard, Platform } from 'react-native';
import { useCSSVariable } from 'uniwind';

function color(value: string | number | undefined) {
    return typeof value === 'string' ? value : undefined;
}

/** Android's bottom navigation rides above the keyboard; hide it while a field is focused. */
function useAndroidKeyboardVisible() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (Platform.OS !== 'android') return;

        const show = Keyboard.addListener('keyboardDidShow', () =>
            setVisible(true),
        );
        const hide = Keyboard.addListener('keyboardDidHide', () =>
            setVisible(false),
        );

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    return visible;
}

export default function TabsLayout() {
    const [tint, indicator] = useCSSVariable([
        '--color-primary-foreground',
        '--color-primary-border',
    ]);
    const keyboardVisible = useAndroidKeyboardVisible();

    return (
        <NativeTabs
            hidden={keyboardVisible}
            tintColor={color(tint)}
            iconColor={{ selected: color(tint) }}
            labelStyle={{ selected: { color: color(tint) } }}
            indicatorColor={color(indicator)}
            rippleColor={color(indicator)}
        >
            <NativeTabs.Trigger name="(home)">
                <NativeTabs.Trigger.Label>Головна</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: 'house', selected: 'house.fill' }}
                    md="home"
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(catalog)">
                <NativeTabs.Trigger.Label>Каталог</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{
                        default: 'square.grid.2x2',
                        selected: 'square.grid.2x2.fill',
                    }}
                    md="grid_view"
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(profile)">
                <NativeTabs.Trigger.Label>Профіль</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{
                        default: 'person.crop.circle',
                        selected: 'person.crop.circle.fill',
                    }}
                    md="account_circle"
                />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="(search)" role="search">
                <NativeTabs.Trigger.Label>Пошук</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}
