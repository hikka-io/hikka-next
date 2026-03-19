import { ArticleCategoryEnum } from '@hikka/client';
import { prefetchInfiniteQuery } from '@hikka/react/core';
import {
    articleStatsOptions,
    searchArticlesOptions,
} from '@hikka/react/options';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    ArticleFilters,
    ArticleList,
    PopularAuthors,
    PopularTags,
} from '@/features/articles';

import { generateHeadMeta } from '@/utils/metadata';
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
    head: () =>
        generateHeadMeta({
            title: 'Статті',
            description: 'Статті про аніме, манґу та ранобе на Hikka',
            url: 'https://hikka.io/articles',
        }),
    component: ArticlesPage,
});

function ArticlesPage() {
    return (
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_25%] lg:gap-12 xl:grid-cols-[20%_1fr_20%]">
            <div className="sticky top-20 hidden flex-col gap-8 self-start xl:flex">
                <PopularAuthors />
                <PopularTags />
            </div>
            <ArticleList />
            <div className="border-border bg-secondary/20 sticky top-20 hidden max-h-[calc(100vh-9rem)] w-full self-start overflow-hidden rounded-lg border backdrop-blur-xl sm:flex">
                <ArticleFilters />
            </div>
        </div>
    );
}
