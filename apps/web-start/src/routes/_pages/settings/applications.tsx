import { prefetchInfiniteQuery } from '@hikka/react/core';
import { clientListOptions } from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ApplicationsSettings, ClientCreateButton } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/applications')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        await prefetchInfiniteQuery(queryClient, clientListOptions(hikkaClient));
    },
    head: () => ({
        meta: [{ title: 'Застосунки / Налаштування / Hikka' }],
    }),
    component: ApplicationsSettingsPage,
});

function ApplicationsSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Застосунки</HeaderTitle>
                        <ClientCreateButton />
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Підключіть OAuth авторизацію через hikka за допомогою
                    застосунку (для розробників)
                </p>
            </div>
            <ApplicationsSettings />
        </div>
    );
}
