import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Effects } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/customization/effects')({
    head: () => ({
        meta: [{ title: 'Ефекти / Кастомізація / Hikka' }],
    }),
    component: CustomizationEffectsPage,
});

function CustomizationEffectsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Ефекти</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Керуйте візуальними ефектами інтерфейсу
                </p>
            </div>
            <Effects />
        </div>
    );
}
