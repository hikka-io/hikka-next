import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import { EditContentList, TodoContentTabs } from '@/features/edit';
import { useTodoFilters } from '@/features/edit/hooks/use-todo-filters';
import { TodoFiltersModal } from '@/features/edit/todo-content';
import { HeaderFiltersButton } from '@/features/filters';
import { editContentSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/content')({
    validateSearch: zodValidator(editContentSearchSchema),
    head: () => ({
        meta: [{ title: 'Контент / Правки / Hikka' }],
    }),
    component: ContentPage,
});

function ContentPage() {
    const titleAnchor = usePageTitleAnchor();
    const { contentType, filters, activeCount, setFilters } = useTodoFilters();

    usePageHeader({
        title: 'Незаповнений контент',
        parent: '/edit',
        anchored: true,
        actionsAnchored: true,
        actionsComponent: () => (
            <HeaderFiltersButton
                count={activeCount}
                renderModal={(props) => (
                    <TodoFiltersModal
                        {...props}
                        contentType={contentType}
                        value={filters}
                        onChange={setFilters}
                    />
                )}
            />
        ),
    });

    return (
        <Block>
            <Header>
                <HeaderContainer>
                    <HeaderTitle ref={titleAnchor} variant="h2">
                        Незаповнений контент
                    </HeaderTitle>
                </HeaderContainer>
            </Header>
            <TodoContentTabs value={contentType} />
            <EditContentList />
        </Block>
    );
}
