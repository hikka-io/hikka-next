import { createFileRoute } from '@tanstack/react-router';

import {
    listUserClientsInfiniteOptions,
    paginationPageParam,
} from '@hikka/api';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ClientApps, ClientCreateButton } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/applications/clients')({
    loader: async ({ context: { queryClient, apiClient } }) => {
        await queryClient.prefetchInfiniteQuery({
            ...listUserClientsInfiniteOptions({ client: apiClient }),
            ...paginationPageParam(),
        });
    },
    head: () => ({
        meta: [{ title: 'Мої застосунки / Налаштування / Hikka' }],
    }),
    component: ClientAppsPage,
});

function ClientAppsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Мої застосунки</HeaderTitle>
                        <ClientCreateButton />
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Створюйте та керуйте власними OAuth-застосунками
                </p>
            </div>
            <ClientApps />
        </div>
    );
}
