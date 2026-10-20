import { Stack } from 'expo-router';

import { NotificationsSettings } from '@/features/settings';

export default function NotificationsSettingsScreen() {
    return (
        <>
            <Stack.Title>Сповіщення</Stack.Title>
            <NotificationsSettings />
        </>
    );
}
