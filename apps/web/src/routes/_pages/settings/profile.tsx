import { createFileRoute } from '@tanstack/react-router';

import {
    ProfileDescription,
    ProfileImages,
    ProfileUsername,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/profile')({
    head: () => settingsHead('Профіль'),
    component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
    return (
        <SettingsPage
            title="Профіль"
            description="Налаштуйте вигляд та деталі свого профілю"
        >
            <ProfileImages />
            <ProfileUsername />
            <ProfileDescription />
        </SettingsPage>
    );
}
