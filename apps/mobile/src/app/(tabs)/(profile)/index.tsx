import { Stack } from 'expo-router';

import { ProfileSummary, signOut, useSession } from '@/features/auth';

export default function ProfileScreen() {
    const { hasToken } = useSession();

    return (
        <>
            <Stack.Title large>Профіль</Stack.Title>
            {hasToken ? (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Button
                        icon="rectangle.portrait.and.arrow.right"
                        accessibilityLabel="Вийти"
                        onPress={signOut}
                    />
                </Stack.Toolbar>
            ) : null}
            <ProfileSummary />
        </>
    );
}
