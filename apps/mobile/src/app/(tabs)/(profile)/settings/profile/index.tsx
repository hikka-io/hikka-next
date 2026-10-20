import { Stack } from 'expo-router';

import { ProfileSettings } from '@/features/settings';

export default function ProfileSettingsScreen() {
    return (
        <>
            <Stack.Title>Профіль</Stack.Title>
            <ProfileSettings />
        </>
    );
}
