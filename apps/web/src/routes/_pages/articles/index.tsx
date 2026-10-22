import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { getArticleTopOptions, paginationPageParam } from '@hikka/api';
import { articlesSearchSchema } from '@hikka/core';

import { usePageHeader } from '@/features/app-shell';
import {
    ArticleFiltersButton,
    ArticleList,
    ArticleListFilters,
    ArticleListPopularAuthors,
    ArticleListPopularTags,
} from '@/features/articles';
import { articleListOptions } from '@/features/articles/queries';
import { FiltersSidebar } from '@/features/filters';
import { generateHeadMeta } from '@/utils/metadata';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/articles/')({
    validateSearch: zodValidator(articlesSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        await Promise.all([
            queryClient.prefetchInfiniteQuery(
                articleListOptions(deps, apiClient),
            ),
            queryClient.prefetchQuery(
                getArticleTopOptions({ client: apiClient }),
            ),
        ]);
    },
    head: () =>
        generateHeadMeta({
            title: 'Статті',
            description: 'Статті про аніме, манґу та ранобе на Hikka',
            url: `${SITE_ORIGIN}/articles`,
        }),
    component: ArticlesPage,
});

function ArticlesPage() {
    usePageHeader({
        title: 'Статті',
        parent: '/',
        anchored: true,
        actionsAnchored: true,
        actionsComponent: () => <ArticleFiltersButton inHeader />,
    });

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-[1fr_20rem] xl:grid-cols-[20rem_1fr_20rem]">
            <div className="sticky top-20 hidden flex-col gap-8 self-start xl:flex">
                <ArticleListPopularAuthors />
                <ArticleListPopularTags />
            </div>
            <ArticleList />
            <FiltersSidebar className="self-start md:flex">
                <ArticleListFilters />
            </FiltersSidebar>
        </div>
    );
}
