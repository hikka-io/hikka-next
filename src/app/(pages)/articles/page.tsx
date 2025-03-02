import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import ArticleList from '@/features/articles/article-list/article-list.component';
import PopularAuthors from '@/features/articles/article-list/popular-authors.component';
import PopularTags from '@/features/articles/article-list/popular-tags.component';
import ArticleFilters from '@/features/filters/article-filters.component';

import { prefetchArticleStats } from '@/services/hooks/articles/use-article-stats';
import { prefetchArticles } from '@/services/hooks/articles/use-articles';
import getQueryClient from '@/utils/get-query-client';

const ArticlesPage = async (props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<Record<string, any>>;
}) => {
    const searchParams = await props.searchParams;

    const queryClient = await getQueryClient();

    const author = searchParams.author || undefined;
    const sort = searchParams.sort || 'created';
    const order = searchParams.order || 'desc';
    const tags = searchParams.tags || [];
    const draft = Boolean(searchParams.draft) ?? false;
    const categories = searchParams.categories || [];

    await prefetchArticles({
        author: author as string,
        sort: [`${sort}:${order}`],
        tags: tags as string[],
        draft: draft,
        categories: categories as API.ArticleCategory[],
    });

    await prefetchArticleStats({});

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_25%] lg:grid-cols-[20%_1fr_20%] lg:gap-16">
                <div className="sticky top-20 hidden flex-col gap-12 self-start lg:flex">
                    <PopularAuthors />
                    <PopularTags />
                </div>
                <ArticleList />
                <div className="sticky top-20 hidden w-full self-start opacity-60 transition-opacity hover:opacity-100 md:flex lg:block">
                    <ArticleFilters />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ArticlesPage;
