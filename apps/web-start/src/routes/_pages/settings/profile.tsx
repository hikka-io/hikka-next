import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    ProfileAppearance,
    ProfileDescription,
    ProfileUsername,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/profile')({
    head: () => ({
        meta: [{ title: 'Профіль / Налаштування / Hikka' }],
    }),
    component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Профіль</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-sm text-muted-foreground">
                    Налаштуйте вигляд та деталі свого профілю
                </p>
            </div>
            <ProfileAppearance />
            <ProfileUsername />
            <ProfileDescription />
        </div>
    );
}
