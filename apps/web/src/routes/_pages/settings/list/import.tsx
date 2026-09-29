import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { ReadListImport, WatchListImport } from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/list/import')({
    head: () => ({
        meta: [{ title: 'Імпорт списку / Налаштування / Hikka' }],
    }),
    component: ListImportPage,
});

function ListImportPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Імпорт</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-muted-foreground text-sm">
                    Імпортуйте аніме, манґу та ранобе з інших сервісів
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Імпорт аніме</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <WatchListImport />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">
                            Імпорт манґи та ранобе
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ReadListImport />
            </div>
        </div>
    );
}
