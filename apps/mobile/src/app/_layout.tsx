import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { restoreAuthToken } from '@/features/auth';
import { queryClient } from '@/utils/query-client';

restoreAuthToken();

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
                </Stack>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
