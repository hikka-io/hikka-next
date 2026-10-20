import { Stack } from 'expo-router';

import { GeneralSettings } from '@/features/settings';

export default function GeneralSettingsScreen() {
    return (
        <>
            <Stack.Title>Загальне</Stack.Title>
            <GeneralSettings />
        </>
    );
}
