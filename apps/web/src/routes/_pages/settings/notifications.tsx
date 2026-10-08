import { createFileRoute } from '@tanstack/react-router';

import { getIgnoredNotificationsOptions } from '@hikka/api';

import {
    NotificationsSettings,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/notifications')({
    loader: async ({ context: { queryClient, apiClient } }) => {
        await queryClient.prefetchQuery(
            getIgnoredNotificationsOptions({ client: apiClient }),
        );
    },
    head: () => settingsHead('Сповіщення'),
    component: NotificationsSettingsPage,
});

function NotificationsSettingsPage() {
    return (
        <SettingsPage
            title="Сповіщення"
            description="Налаштуйте персоналізовані сповіщення"
        >
            <NotificationsSettings />
        </SettingsPage>
    );
}
