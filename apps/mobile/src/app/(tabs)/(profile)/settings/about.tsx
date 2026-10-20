import { Stack } from 'expo-router';

import { AboutSettings } from '@/features/settings';

export default function AboutSettingsScreen() {
    return (
        <>
            <Stack.Title>Про застосунок</Stack.Title>
            <AboutSettings />
        </>
    );
}
