import { createFileRoute } from '@tanstack/react-router';

import {
    listUserClientsInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import {
    ClientApps,
    ClientCreateButton,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/applications/clients')({
    loader: async ({ context: { queryClient, apiClient } }) => {
        await queryClient.prefetchInfiniteQuery({
            ...listUserClientsInfiniteOptions({ client: apiClient }),
            ...paginationPageParam(),
        });
    },
    head: () => settingsHead('Мої застосунки'),
    component: ClientAppsPage,
});

function ClientAppsPage() {
    return (
        <SettingsPage
            title="Мої застосунки"
            description="Створюйте та керуйте власними OAuth-застосунками"
            action={<ClientCreateButton />}
        >
            <ClientApps />
        </SettingsPage>
    );
}
