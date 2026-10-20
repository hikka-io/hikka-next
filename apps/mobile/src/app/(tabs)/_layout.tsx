import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabsLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="(catalog)">
                <NativeTabs.Trigger.Label>Аніме</NativeTabs.Trigger.Label>
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
