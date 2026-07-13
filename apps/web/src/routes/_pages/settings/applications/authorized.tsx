import { createFileRoute } from '@tanstack/react-router';

import {
    paginationPageParam,
    thirdPartyAuthTokensInfiniteOptions,
} from '@hikka/api';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { AuthorizedAppsSettings } from '@/features/settings';

export const Route = createFileRoute(
    '/_pages/settings/applications/authorized',
)({
    loader: async ({ context: { queryClient, apiClient } }) => {
        await queryClient.prefetchInfiniteQuery({
            ...thirdPartyAuthTokensInfiniteOptions({ client: apiClient }),
            ...paginationPageParam(),
        });
    },
    head: () => ({
        meta: [{ title: 'Авторизовані застосунки / Налаштування / Hikka' }],
    }),
    component: AuthorizedAppsPage,
});

function AuthorizedAppsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Авторизовані застосунки</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Застосунки, яким ви надали доступ до свого акаунту
                </p>
            </div>
            <AuthorizedAppsSettings />
        </div>
    );
}
