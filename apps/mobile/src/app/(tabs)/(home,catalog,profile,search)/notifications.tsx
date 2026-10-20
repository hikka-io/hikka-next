import { Stack } from 'expo-router';

import { NotificationsScreen } from '@/features/notifications';

export default function NotificationsRoute() {
    return (
        <>
            <Stack.Title>Сповіщення</Stack.Title>
            <NotificationsScreen />
        </>
    );
}
