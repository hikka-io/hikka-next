import { Stack } from 'expo-router';

import { AppearanceSettings } from '@/features/settings';

export default function AppearanceSettingsScreen() {
    return (
        <>
            <Stack.Title>Вигляд</Stack.Title>
            <AppearanceSettings />
        </>
    );
}
