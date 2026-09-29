import { createFileRoute } from '@tanstack/react-router';

import {
    EmailSettings,
    PasswordSettings,
    SettingsPage,
    SettingsSection,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/security')({
    head: () => settingsHead('Безпека'),
    component: SecuritySettingsPage,
});

function SecuritySettingsPage() {
    return (
        <SettingsPage
            title="Безпека"
            description="Захистіть свій обліковий запис: змініть пароль чи email"
        >
            <SettingsSection title="Поштова адреса">
                <EmailSettings />
            </SettingsSection>
            <SettingsSection title="Пароль">
                <PasswordSettings />
            </SettingsSection>
        </SettingsPage>
    );
}
