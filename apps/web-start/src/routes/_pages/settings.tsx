import { queryKeys } from '@hikka/react/core';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { SettingsMenu } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings')({
    beforeLoad: async ({ context: { queryClient } }) => {
        const session = queryClient.getQueryData(queryKeys.user.me());
        if (!session) throw redirect({ to: '/login' });
    },
    head: () => ({
        meta: [{ title: 'Налаштування / Hikka' }],
    }),
    component: SettingsLayout,
});

function SettingsLayout() {
    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">Налаштування</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <SettingsMenu />
            </Block>
            <div className="flex flex-col gap-12">
                <Outlet />
            </div>
        </div>
    );
}
