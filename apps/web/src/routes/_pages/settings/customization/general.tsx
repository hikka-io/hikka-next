import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Preferences } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/customization/general')({
    head: () => ({
        meta: [{ title: 'Загальне / Кастомізація / Hikka' }],
    }),
    component: CustomizationGeneralPage,
});

function CustomizationGeneralPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Загальне</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Налаштуйте відображення контенту та інше
                </p>
            </div>
            <Preferences />
        </div>
    );
}
