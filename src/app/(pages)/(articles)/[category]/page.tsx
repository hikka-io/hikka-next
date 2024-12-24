import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import ArticleList from '@/features/articles/article-list/article-list.component';
import PopularAuthors from '@/features/articles/article-list/popular-authors.component';
import PopularTags from '@/features/articles/article-list/popular-tags.component';
import ArticleFilters from '@/features/filters/article-filters.component';

import { prefetchArticles } from '@/services/hooks/articles/use-articles';
import getQueryClient from '@/utils/get-query-client';

const ArticlesPage = async (props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<Record<string, any>>;
}) => {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const { category } = params;

    const queryClient = await getQueryClient();

    const author = searchParams.author || undefined;
    const sort = searchParams.sort || 'created';
    const order = searchParams.order || 'desc';

    await prefetchArticles({
        category,
        author: author as string,
        sort: [`${sort}:${order}`],
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_25%] lg:grid-cols-[20%_1fr_20%] lg:gap-16">
                <div className="sticky top-20 hidden flex-col gap-12 self-start lg:flex">
                    <PopularAuthors />
                    <PopularTags />
                </div>
                <ArticleList />
                <div className="sticky top-20 hidden flex-col gap-12 self-start md:flex">
                    <ArticleFilters />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ArticlesPage;
