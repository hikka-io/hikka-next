import { createFileRoute } from '@tanstack/react-router';

import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import {
    ListExport,
    ListRemoval,
    ReadlistSettings,
    WatchlistSettings,
} from '@/features/settings';

export const Route = createFileRoute('/_pages/settings/list')({
    head: () => ({
        meta: [{ title: 'Список / Налаштування / Hikka' }],
    }),
    component: ListSettingsPage,
});

function ListSettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle>Список</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <p className="text-sm text-muted-foreground">
                    Імпорт і експорт аніме, манґи та ранобе.
                </p>
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">Імпорт аніме</HeaderTitle>
                    </HeaderContainer>
                </Header>
                <WatchlistSettings />
            </div>
            <div className="flex flex-col gap-4">
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h4">
                            Імпорт манґи та ранобе
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>
                <ReadlistSettings />
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
