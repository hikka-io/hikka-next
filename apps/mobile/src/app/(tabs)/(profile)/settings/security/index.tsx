import { Stack } from 'expo-router';

import { SecurityHome } from '@/features/settings';

export default function SecurityHomeScreen() {
    return (
        <>
            <Stack.Title>Безпека</Stack.Title>
            <SecurityHome />
        </>
    );
}
