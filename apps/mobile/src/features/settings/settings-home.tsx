import type { FC } from 'react';

import { FieldGroup } from '@expo/ui';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { signOut } from '@/features/auth';

import SettingsActionRow from './settings-action-row';
import SettingsForm from './settings-form';
import SettingsNavRow from './settings-nav-row';

const SettingsHome: FC = () => {
    const router = useRouter();

    const confirmSignOut = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Вийти з акаунту?', undefined, [
            { text: 'Скасувати', style: 'cancel' },
            {
                text: 'Вийти',
                style: 'destructive',
                onPress: () => signOut().then(() => router.back()),
            },
        ]);
    };

    return (
        <SettingsForm>
            <FieldGroup.Section title="Акаунт">
                <SettingsNavRow title="Профіль" href="/settings/profile" />
                <SettingsNavRow title="Безпека" href="/settings/security" />
                <SettingsNavRow
                    title="Сповіщення"
                    href="/settings/notifications"
                />
            </FieldGroup.Section>
            <FieldGroup.Section title="Застосунок">
                <SettingsNavRow title="Загальне" href="/settings/general" />
                <SettingsNavRow title="Вигляд" href="/settings/appearance" />
                <SettingsNavRow title="Про застосунок" href="/settings/about" />
            </FieldGroup.Section>
            <FieldGroup.Section>
                <SettingsActionRow
                    title="Вийти"
                    destructive
                    onPress={confirmSignOut}
                />
            </FieldGroup.Section>
        </SettingsForm>
    );
};

export default SettingsHome;
