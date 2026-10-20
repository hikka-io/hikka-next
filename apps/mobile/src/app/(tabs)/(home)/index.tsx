import { Stack } from 'expo-router';

import { HomeScreen } from '@/features/home';
import { NotificationsBell } from '@/features/notifications';

export default function HomeRoute() {
    return (
        <>
            <Stack.Title large>Головна</Stack.Title>
            <NotificationsBell />
            <HomeScreen />
        </>
    );
}
