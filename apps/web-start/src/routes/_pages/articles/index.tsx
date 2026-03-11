import { ArticleCategoryEnum } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import {
    articleStatsOptions,
    searchArticlesOptions,
} from '@hikka/react/options';
import { zodValidator } from '@tanstack/zod-adapter';
import { createFileRoute } from '@tanstack/react-router';

import {
    ArticleFilters,
    ArticleList,
    PopularAuthors,
    PopularTags,
} from '@/features/articles';
import { articlesSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/articles/')({
    validateSearch: zodValidator(articlesSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, hikkaClient }, deps }) => {
        const {
            author,
            sort = 'created',
            order = 'desc',
            tags = [],
            draft,
            categories = [],
        } = deps;

        await Promise.allSettled([
            prefetchInfiniteQuery(
                queryClient,
                searchArticlesOptions(hikkaClient, {
                    args: {
                        author: author as string,
                        sort: [`${sort}:${order}`],
                        tags: tags as string[],
                        draft: Boolean(draft),
                        categories: categories as ArticleCategoryEnum[],
                    },
                }),
            ),
            queryClient.prefetchQuery(articleStatsOptions(hikkaClient)),
        ]);
    },
    head: () => ({
        meta: [{ title: 'Статті / Hikka' }],
    }),
    component: ArticlesPage,
});

function ArticlesPage() {
    return (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_25%] xl:grid-cols-[20%_1fr_20%] lg:gap-12">
            <div className="sticky top-20 hidden flex-col gap-8 self-start xl:flex">
                <PopularAuthors />
                <PopularTags />
            </div>
            <ArticleList />
            <div className="sticky top-20 hidden w-full max-h-[calc(100vh-9rem)] self-start rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden sm:flex">
                <ArticleFilters />
            </div>
        </div>
    );
}
