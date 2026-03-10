import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Effects, Preferences, Styles } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/customization')({
    head: () => ({
        meta: [{ title: 'Кастомізація / Налаштування / Hikka' }],
    }),
    component: CustomizationSettingsPage,
});

function CustomizationSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Кастомізація</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-sm text-muted-foreground">
                    Налаштуйте відображення контенту, теми та інше
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Загальне</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Preferences />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Вигляд</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Styles />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Ефекти</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <Effects />
            </div>
        </div>
    );
}
