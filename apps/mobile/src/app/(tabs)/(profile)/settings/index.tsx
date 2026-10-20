import { Stack } from 'expo-router';

import { SettingsHome } from '@/features/settings';

export default function SettingsScreen() {
    return (
        <>
            <Stack.Title>Налаштування</Stack.Title>
            <SettingsHome />
        </>
    );
}
