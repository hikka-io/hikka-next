import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Styles, StylesResetButton } from '@/features/settings';

export const Route = createFileRoute(
    '/_pages/settings/customization/appearance',
)({
    head: () => ({
        meta: [{ title: 'Вигляд / Кастомізація / Hikka' }],
    }),
    component: CustomizationAppearancePage,
});

function CustomizationAppearancePage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Вигляд</HeaderTitle>
                    </HeaderContainer>
                    <StylesResetButton />
                </Header>
                <p className="text-muted-foreground text-sm">
                    Налаштуйте теми, кольори та відображення
                </p>
            </div>
            <Styles />
        </div>
    );
}
