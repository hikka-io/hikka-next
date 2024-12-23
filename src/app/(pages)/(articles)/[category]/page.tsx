import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import ArticleList from '@/features/articles/article-list/article-list.component';
import PopularAuthors from '@/features/articles/article-list/popular-authors.component';
import PopularTags from '@/features/articles/article-list/popular-tags.component';
import ArticleFilters from '@/features/filters/article-filters.component';

import getQueryClient from '@/utils/get-query-client';

const ArticlesPage = async (props: {
    params: Promise<Record<string, any>>;
}) => {
    const queryClient = await getQueryClient();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr_20%] lg:gap-16">
                <div className="flex flex-col gap-12 sticky self-start top-20">
                    <PopularAuthors />
                    <PopularTags />
                </div>
                <ArticleList />
                <div className="flex flex-col gap-12 sticky self-start top-20">
                    <ArticleFilters />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ArticlesPage;
