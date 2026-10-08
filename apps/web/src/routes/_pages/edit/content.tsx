import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import Block from '@/components/ui/block';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { usePageHeader, usePageTitleAnchor } from '@/features/app-shell';
import {
    TodoContentList,
    TodoContentNavbar,
    TodoContentTabs,
    TodoFilters,
    TodoFiltersBody,
    TodoListSummary,
    useTodoFilters,
} from '@/features/edit';
import {
    ClearFiltersFooter,
    FiltersModal,
    FiltersSidebarLayout,
    HeaderFiltersButton,
    type RenderFiltersModal,
} from '@/features/filters';
import { generateHeadMeta } from '@/utils/metadata';
import { editContentSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/edit/content')({
    validateSearch: zodValidator(editContentSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Незаповнений контент',
            description:
                'Аніме, манґа, ранобе, персонажі та люди з незаповненими даними — знайдіть, що можна доповнити правкою',
            url: `${SITE_ORIGIN}/edit/content`,
        }),
    component: ContentPage,
});

function ContentPage() {
    const titleAnchor = usePageTitleAnchor();
    const { contentType, filters, setFilters } = useTodoFilters();

    const renderFiltersModal: RenderFiltersModal = ({ open, onOpenChange }) => (
        <FiltersModal
            open={open}
            onOpenChange={onOpenChange}
            body={
                <TodoFiltersBody
                    className="-m-4 flex-1 overflow-hidden overflow-y-auto p-4"
                    contentType={contentType}
                    value={filters}
                    onChange={setFilters}
                />
            }
            footer={
                <ClearFiltersFooter
                    className="w-full"
                    preserve={['tab']}
                    onDone={() => onOpenChange(false)}
                />
            }
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

            <FiltersSidebarLayout
                collapsible={false}
                className="grid grid-cols-1 lg:grid-cols-[1fr_30%] lg:items-start lg:gap-x-10 xl:grid-cols-[1fr_25%]"
                sidebar={
                    <TodoFilters
                        contentType={contentType}
                        value={filters}
                        onChange={setFilters}
                    />
                }
            >
                <TodoContentNavbar
                    contentType={contentType}
                    renderFilterModal={renderFiltersModal}
                />
                <TodoListSummary />
                <TodoContentList />
            </FiltersSidebarLayout>
        </Block>
    );
}
