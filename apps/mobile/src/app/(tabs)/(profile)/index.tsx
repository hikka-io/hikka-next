import { Stack, useRouter } from 'expo-router';

import { ProfileSummary, signOut, useSession } from '@/features/auth';
import { SETTINGS_ICON } from '@/features/settings';

export default function ProfileScreen() {
    const { hasToken } = useSession();
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
