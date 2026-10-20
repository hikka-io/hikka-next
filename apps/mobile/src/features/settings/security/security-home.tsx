import type { FC } from 'react';

import { FieldGroup } from '@expo/ui';

import { useSession } from '@/features/auth';

import SettingsForm from '../settings-form';
import SettingsLoading from '../settings-loading';
import SettingsNavRow from '../settings-nav-row';

const SecurityHome: FC = () => {
    const { user, isPending, error, refetch } = useSession();

    if (!user) {
        return (
            <SettingsLoading
                isPending={isPending}
                error={error}
                onRetry={() => void refetch()}
            />
        );
    }

    return (
        <SettingsForm>
            <FieldGroup.Section title="Вхід в акаунт">
                <SettingsNavRow
                    title="Email"
                    value={user.email ?? undefined}
                    href="/settings/security/email"
                />
                <SettingsNavRow
                    title="Імʼя користувача"
                    value={user.username ?? undefined}
                    href="/settings/security/username"
                />
                <SettingsNavRow
                    title="Пароль"
                    href="/settings/security/password"
                />
            </FieldGroup.Section>
        </SettingsForm>
    );
};

export default SecurityHome;
