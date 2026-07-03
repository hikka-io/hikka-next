import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import {
    type ArticleCategoryEnum,
    getArticlesInfiniteOptions,
    getArticleTopOptions,
    paginationPageParam,
} from '@hikka/api';

import {
    ArticleFilters,
    ArticleList,
    PopularAuthors,
    PopularTags,
} from '@/features/articles';
import { expandSort } from '@/features/filters/sort';
import { generateHeadMeta } from '@/utils/metadata';
import { articlesSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/articles/')({
    validateSearch: zodValidator(articlesSearchSchema),
    loaderDeps: ({ search }) => search,
    loader: async ({ context: { queryClient, apiClient }, deps }) => {
        const { author, tags = [], draft, categories = [] } = deps;

        await Promise.allSettled([
            queryClient.ensureInfiniteQueryData({
                ...getArticlesInfiniteOptions({
                    body: {
                        author: author as string,
                        sort: expandSort('article', deps.sort, deps.order),
                        tags: tags as string[],
                        draft: Boolean(draft),
                        categories: categories as ArticleCategoryEnum[],
                    },
                    client: apiClient,
                }),
                ...paginationPageParam(),
            }),
            queryClient.prefetchQuery(
                getArticleTopOptions({ client: apiClient }),
            ),
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_20rem] xl:grid-cols-[20rem_1fr_20rem]">
            <div className="sticky top-20 hidden flex-col gap-4 self-start xl:flex">
                <PopularAuthors />
                <PopularTags />
            </div>
            <ArticleList />
            <div className="sticky top-20 hidden max-h-[calc(100vh-9rem)] w-full self-start overflow-hidden rounded-lg border border-border surface sm:flex">
                <ArticleFilters />
            </div>
        </div>
    );
}
