import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import ArticleAuthor from '@/features/articles/article-view/article-author.component';
import ArticleDocument from '@/features/articles/article-view/article-document.component';
import ArticleNavbar from '@/features/articles/article-view/article-navbar/article-navbar.component';
import ArticleTags from '@/features/articles/article-view/article-tags.component';
import ArticleTitle from '@/features/articles/article-view/article-title.component';

import getArticle from '@/services/api/articles/getArticle';
import { key, prefetchArticle } from '@/services/hooks/articles/use-article';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

export interface MetadataProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const article = await getArticle({
        params: {
            slug: params.slug,
        },
    });

    return _generateMetadata({
        title: article.title,
        keywords: article.tags.map((tag) => tag.name).join(', '),
    });
}

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
                        href={`${CONTENT_TYPE_LINKS['article']}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                {article.category !== 'system' && (
                    <Card className="gap-0 overflow-hidden p-0">
                        <ArticleAuthor />
                    </Card>
                )}
                <Block>
                    <ArticleTitle />
                    <ArticleDocument />
                    <ArticleTags />
                </Block>
                <ArticleNavbar />
            </div>
        </HydrationBoundary>
    );
};

export default ArticlePage;
