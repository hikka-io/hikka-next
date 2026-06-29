import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { EmailSettings, PasswordSettings } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/security')({
    head: () => ({
        meta: [{ title: 'Безпека / Налаштування / Hikka' }],
    }),
    component: SecuritySettingsPage,
});

function SecuritySettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Безпека</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Захистіть свій обліковий запис: змініть пароль чи email
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Поштова адреса</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <EmailSettings />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Пароль</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <PasswordSettings />
            </div>
        </div>
    );
}
