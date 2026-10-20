import { Stack } from 'expo-router';

import { LinksSettings } from '@/features/settings';

export default function LinksSettingsScreen() {
    return (
        <>
            <Stack.Title>Посилання</Stack.Title>
            <LinksSettings />
        </>
    );
}
