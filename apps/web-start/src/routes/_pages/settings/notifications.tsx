import { ignoredNotificationsOptions } from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';

import { NotificationsSettings } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/notifications')({
    loader: async ({ context: { queryClient, hikkaClient } }) => {
        await queryClient.prefetchQuery(
            ignoredNotificationsOptions(hikkaClient),
        );
    },
    head: () => ({
        meta: [{ title: 'Сповіщення / Налаштування / Hikka' }],
    }),
    component: NotificationsSettingsPage,
});

function NotificationsSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Сповіщення</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Налаштуйте персоналізовані сповіщення
                </p>
            </div>
            <NotificationsSettings />
        </div>
    );
}
