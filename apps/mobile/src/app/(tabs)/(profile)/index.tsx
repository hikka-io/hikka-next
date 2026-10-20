import { Stack, useRouter } from 'expo-router';

import { ProfileSummary, useSession } from '@/features/auth';
import { SETTINGS_ICON } from '@/features/settings';
import { UserPage } from '@/features/users';

export default function ProfileScreen() {
    const { hasToken, user } = useSession();
    const router = useRouter();

    return (
        <>
            <Stack.Title large>Профіль</Stack.Title>
            {hasToken ? (
                <Stack.Toolbar placement="right">
                    <Stack.Toolbar.Button
                        icon={SETTINGS_ICON}
                        accessibilityLabel="Налаштування"
                        onPress={() => router.push('/settings')}
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
