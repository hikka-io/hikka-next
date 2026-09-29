import { createFileRoute } from '@tanstack/react-router';

import {
    paginationPageParam,
    thirdPartyAuthTokensInfiniteOptions,
} from '@hikka/api';

import {
    AuthorizedAppsSettings,
    SettingsPage,
    settingsHead,
} from '@/features/settings';

export const Route = createFileRoute(
    '/_pages/settings/applications/authorized',
)({
    loader: async ({ context: { queryClient, apiClient } }) => {
        await queryClient.prefetchInfiniteQuery({
            ...thirdPartyAuthTokensInfiniteOptions({ client: apiClient }),
            ...paginationPageParam(),
        });
    },
    head: () => settingsHead('Авторизовані застосунки'),
    component: AuthorizedAppsPage,
});

function AuthorizedAppsPage() {
    return (
        <SettingsPage
            title="Авторизовані застосунки"
            description="Застосунки, яким ви надали доступ до свого акаунту"
        >
            <AuthorizedAppsSettings />
        </SettingsPage>
    );
}
