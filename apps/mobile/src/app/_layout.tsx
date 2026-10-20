import '@/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';

import { configureBrowserClient } from '@hikka/api';

import RouteErrorBoundary from '@/components/route-error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { readStoredAuthToken } from '@/features/auth';
import { applyStoredAppearance, UserStylesEffect } from '@/features/settings';
import { API_BASE_URL, queryClient } from '@/utils/query-client';

configureBrowserClient({
    baseUrl: API_BASE_URL,
    authToken: readStoredAuthToken(),
});
applyStoredAppearance();

export { RootErrorBoundary as ErrorBoundary } from '@/components/route-error-boundary';

// Deep links to a sheet route (email links) keep the tabs underneath instead of opening the sheet as the only screen.
export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
    const scheme = useColorScheme();

    return (
        <QueryClientProvider client={queryClient}>
            <UserStylesEffect />
            <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack
                    screenOptions={{ headerShown: false }}
                    unstable_screenErrorBoundary={RouteErrorBoundary}
                >
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
                        name="signup"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [1],
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="reset"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: 'fitToContents',
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="auth/reset/[token]"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: 'fitToContents',
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="auth/activate/[token]"
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
                        name="comment/[content_type]/[slug]"
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [1],
                            sheetGrabberVisible: true,
                        }}
                    />
                    <Stack.Screen
                        name="dev/markdown"
                        options={{ headerShown: true, title: 'Markdown' }}
                    />
                    <Stack.Screen
                        name="dev/recycling"
                        options={{ headerShown: true, title: 'Recycling' }}
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
