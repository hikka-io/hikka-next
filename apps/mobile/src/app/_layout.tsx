import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { configureBrowserClient } from '@hikka/api';

import { Toaster } from '@/components/ui/toaster';
import { readStoredAuthToken } from '@/features/auth';
import { API_BASE_URL, queryClient } from '@/utils/query-client';

configureBrowserClient({
    baseUrl: API_BASE_URL,
    authToken: readStoredAuthToken(),
});

export default function RootLayout() {
    const scheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen
                        name="login"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: 'fitToContents',
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="catalog-filters"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [0.75, 1],
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="list-entry/[content_type]/[slug]"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [0.75, 1],
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="dev/markdown"
                        options={{ headerShown: true, title: 'Markdown' }}
                    />
                    <Stack.Screen
                        name="dev/tracking"
                        options={{ headerShown: true, title: 'Tracking' }}
                    />
                    <Stack.Screen
                        name="dev/ui"
                        options={{ headerShown: true, title: 'UI' }}
                    />
                </Stack>
                <Toaster />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
