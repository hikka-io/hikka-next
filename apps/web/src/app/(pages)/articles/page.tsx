import { ArticleCategoryEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import {
    prefetchArticleStats,
    prefetchSearchArticles,
} from '@hikka/react/server';

import { ArticleList, PopularAuthors, PopularTags } from '@/features/articles';
import { ArticleFilters } from '@/features/filters';

import { getHikkaClientConfig } from '@/utils/hikka-client';

const ArticlesPage = async (props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<Record<string, any>>;
}) => {
    const searchParams = await props.searchParams;

    const queryClient = await getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const author = searchParams.author || undefined;
    const sort = searchParams.sort || 'created';
    const order = searchParams.order || 'desc';
    const tags = searchParams.tags || [];
    const draft = Boolean(searchParams.draft) ?? false;
    const categories = searchParams.categories || [];

    await prefetchSearchArticles({
        args: {
            author: author as string,
            sort: [`${sort}:${order}`],
            tags: tags as string[],
            draft: draft,
            categories: categories as ArticleCategoryEnum[],
        },
        clientConfig,
        queryClient,
    });

    await prefetchArticleStats({ clientConfig, queryClient });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_25%] xl:grid-cols-[20%_1fr_20%] lg:gap-12">
                <div className="sticky top-20 hidden flex-col gap-12 self-start xl:flex">
                    <PopularAuthors />
                    <PopularTags />
                </div>
                <ArticleList />
                <div className="sticky top-20 hidden w-full max-h-[calc(100vh-9rem)] self-start rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden sm:flex">
                    <ArticleFilters />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ArticlesPage;
