import { Stack } from 'expo-router';

import { HomeScreen } from '@/features/home';

export default function HomeRoute() {
    return (
        <>
            <Stack.Title large>Головна</Stack.Title>
            <HomeScreen />
        </>
    );
}
