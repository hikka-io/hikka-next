import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import ArticleAuthor from '@/features/articles/article-view/article-author.component';
import ArticleCover from '@/features/articles/article-view/article-cover.component';
import ArticleText from '@/features/articles/article-view/article-text.component';
import ArticleTitle from '@/features/articles/article-view/article-title.component';

import { key, prefetchArticle } from '@/services/hooks/articles/use-article';
import getQueryClient from '@/utils/get-query-client';

const ArticlePage = async (props: { params: Promise<Record<string, any>> }) => {
    const params = await props.params;

    const { slug } = params;

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
                        href={'/articles/' + slug}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <Card className="gap-0 overflow-hidden p-0">
                    <ArticleAuthor />
                    <ArticleCover />
                </Card>
                <Block>
                    <ArticleTitle />
                    <ArticleText />
                </Block>
            </div>
        </HydrationBoundary>
    );
};

export default ArticlePage;
