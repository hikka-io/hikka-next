import { ArticleResponse, ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getHikkaClient,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchArticleBySlug } from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import Block from '@/components/ui/block';
import Card from '@/components/ui/card';

import {
    ArticleAuthor,
    ArticleDocument,
    ArticleNavbar,
    ArticleTags,
    ArticleTitle,
} from '@/features/articles';
import { CommentList as Comments } from "@/features/comments";

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

export interface MetadataProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
    params,
}: MetadataProps): Promise<Metadata> {
    const { slug } = await params;

    const client = getHikkaClient();

    const article: ArticleResponse =
        await client.articles.getArticleBySlug(slug);

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
    const clientConfig = await getHikkaClientConfig();

    const article = await prefetchArticleBySlug({
        slug: slug,
        clientConfig,
        queryClient,
    });

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
            <div className="container isolate flex max-w-3xl flex-col gap-12 p-0">
                {article.category !== 'system' && (
                    <Card className="gap-0 overflow-hidden p-0">
                        <ArticleAuthor />
                    </Card>
                )}
                <Block className="isolate">
                    <ArticleTitle />
                    <ArticleDocument />
                    <ArticleTags />
                    <Comments
                        preview
                        slug={slug}
                        content_type={ContentTypeEnum.ARTICLE}
                    />
                </Block>
                <ArticleNavbar />
            </div>
        </HydrationBoundary>
    );
};

export default ArticlePage;
