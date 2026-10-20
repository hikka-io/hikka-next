import { Stack } from 'expo-router';

import { UsernameForm } from '@/features/settings';

export default function UsernameFormScreen() {
    return (
        <>
            <Stack.Title>Ім'я користувача</Stack.Title>
            <UsernameForm />
        </>
    );
}
