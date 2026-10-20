import { Stack } from 'expo-router';

import { UsernameForm } from '@/features/settings';

export default function UsernameFormScreen() {
    return (
        <>
            <Stack.Title>Імʼя користувача</Stack.Title>
            <UsernameForm />
        </>
    );
}
