import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import {
    TodoContentList,
    TodoContentTabs,
    TodoFilters,
    TodoFiltersModal,
    TodoListSummary,
    useTodoFilters,
} from '@/features/edit';
import { FiltersButton, HeaderFiltersButton } from '@/features/filters';
import { generateHeadMeta } from '@/utils/metadata';
import { editContentSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/edit/content')({
    validateSearch: zodValidator(editContentSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Незаповнений контент',
            description:
                'Аніме, манґа, ранобе, персонажі та люди з незаповненими даними — знайдіть, що можна доповнити правкою',
            url: 'https://hikka.io/edit/content',
        }),
    component: ContentPage,
});

function ContentPage() {
    const titleAnchor = usePageTitleAnchor();
    const { contentType, filters, setFilters } = useTodoFilters();

    const renderFiltersModal = (props: {
        open: boolean;
        onOpenChange: (open: boolean) => void;
    }) => (
        <TodoFiltersModal
            {...props}
            contentType={contentType}
            value={filters}
            onChange={setFilters}
        />
    );

    usePageHeader({
        title: 'Незаповнений контент',
        parent: '/edit',
        anchored: true,
        actionsAnchored: true,
        actionsComponent: () => (
            <HeaderFiltersButton renderModal={renderFiltersModal} />
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

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_30%] lg:items-start lg:gap-x-10 xl:grid-cols-[1fr_25%]">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                        <TodoListSummary />
                        <FiltersButton
                            className="lg:hidden"
                            renderModal={renderFiltersModal}
                        />
                    </div>
                    <TodoContentList />
                </div>

                <div className="sticky top-20 order-1 hidden max-h-[calc(100vh-9rem)] w-full overflow-hidden rounded-lg border border-border surface lg:order-2 lg:flex">
                    <TodoFilters
                        contentType={contentType}
                        value={filters}
                        onChange={setFilters}
                    />
                </div>
            </div>
        </Block>
    );
}
