import { Stack } from 'expo-router';

import { PasswordForm } from '@/features/settings';

export default function PasswordFormScreen() {
    return (
        <>
            <Stack.Title>Пароль</Stack.Title>
            <PasswordForm />
        </>
    );
}
