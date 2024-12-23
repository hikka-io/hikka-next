import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import ArticleCover from '@/features/articles/article-edit/article-cover.component';
import ArticleSettings from '@/features/articles/article-edit/article-settings/article-settings.component';
import ArticleText from '@/features/articles/article-edit/article-text.component';
import ArticleTitle from '@/features/articles/article-edit/article-title.component';

import { key, prefetchArticle } from '@/services/hooks/articles/use-article';
import ArticleProvider from '@/services/providers/article-provider';
import getQueryClient from '@/utils/get-query-client';

const ArticleUpdatePage = async (props: {
    params: Promise<Record<string, any>>;
}) => {
    const params = await props.params;

    const { slug, category } = params;

    const queryClient = await getQueryClient();

    await prefetchArticle({ slug: slug });

    const article: API.Article | undefined = queryClient.getQueryData(
        key({ slug }),
    );

    if (!article) {
        return permanentRedirect('/');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <Link
                        href={`/${category}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <ArticleProvider initialState={{ ...article }}>
                <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_25%] lg:items-start lg:justify-between lg:gap-16">
                    <Block>
                        <ArticleTitle />
                        <ArticleCover />
                        <ArticleText />
                    </Block>
                    <Card className="sticky top-20 order-1 hidden w-full p-0 lg:order-2 lg:block">
                        <ArticleSettings />
                    </Card>
                </div>
            </ArticleProvider>
        </HydrationBoundary>
    );
};

export default ArticleUpdatePage;
