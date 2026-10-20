import { Stack } from 'expo-router';

import { ProfileSummary, signOut, useSession } from '@/features/auth';
import { UserPage } from '@/features/users';

export default function ProfileScreen() {
    const { hasToken, user } = useSession();

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
            {user?.username ? (
                <UserPage
                    key={user.username}
                    username={user.username}
                    headerChrome={false}
                />
            ) : (
                <ProfileSummary />
            )}
        </>
    );
}
