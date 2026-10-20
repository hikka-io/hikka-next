import { Stack } from 'expo-router';

import { EmailForm } from '@/features/settings';

export default function EmailFormScreen() {
    return (
        <>
            <Stack.Title>Email</Stack.Title>
            <EmailForm />
        </>
    );
}
