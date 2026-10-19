import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { queryClient } from '@/utils/query-client';

export default function RootLayout() {
    const scheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
                <NativeTabs>
                    <NativeTabs.Trigger name="(catalog)">
                        <NativeTabs.Trigger.Label>
                            Аніме
                        </NativeTabs.Trigger.Label>
                        <NativeTabs.Trigger.Icon
                            sf={{
                                default: 'square.grid.2x2',
                                selected: 'square.grid.2x2.fill',
                            }}
                            md="grid_view"
                        />
                    </NativeTabs.Trigger>
                    <NativeTabs.Trigger name="(search)" role="search">
                        <NativeTabs.Trigger.Label>
                            Пошук
                        </NativeTabs.Trigger.Label>
                        <NativeTabs.Trigger.Icon
                            sf="magnifyingglass"
                            md="search"
                        />
                    </NativeTabs.Trigger>
                </NativeTabs>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
