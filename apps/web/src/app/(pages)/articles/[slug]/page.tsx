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
import {
    key,
    prefetchArticle,
} from '@/services/hooks/articles/use-article';
import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import _generateMetadata from '@/utils/generate-metadata';
import getQueryClient from '@/utils/get-query-client';

export interface MetadataProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const { slug } = await params;

    const article = await getArticle({
        params: {
            slug: slug,
        },
    });

    return _generateMetadata({
        title: `${article.title} / ${ARTICLE_CATEGORY_OPTIONS[article.category].title_ua}`,
        keywords: article.tags.map((tag) => tag.name).join(', '),
        openGraph: {
            type: 'article',
            authors: [article.author.username],
        },
        alternates: {
            canonical: `https://hikka.io/articles/${slug}`,
        },
    });
}

const ArticlePage = async (props: MetadataProps) => {
    const params = await props.params;

    const { slug } = params;

    const queryClient = getQueryClient();

    await prefetchArticle({ slug: slug });

    const article: API.Article | undefined = queryClient.getQueryData(
        key({ slug }),
    );

    if (!article) {
        return permanentRedirect('/articles');
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        author: {
            '@type': 'Person',
            name: article.author.username,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Hikka',
            logo: {
                '@type': 'ImageObject',
                url: 'https://hikka.io/logo-icon.png',
            },
        },
        datePublished: article.created,
        dateModified: article.updated || article.created,
    };

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                <Block className="isolate">
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
