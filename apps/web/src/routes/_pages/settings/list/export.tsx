import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ListExport, ListRemoval } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/list/export')({
    head: () => ({
        meta: [{ title: 'Експорт списку / Налаштування / Hikka' }],
    }),
    component: ListExportPage,
});

function ListExportPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Експорт</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Експорт та видалення ваших списків.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Експорт списків</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ListExport />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Видалення списку</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ListRemoval />
            </div>
        </div>
    );
}
