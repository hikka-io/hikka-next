import { ArticleDocumentResponse } from '@hikka/client';
import { useArticleBySlug } from '@hikka/react';
import { queryKeys } from '@hikka/react/core';
import { createFileRoute } from '@tanstack/react-router';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import Link from '@/components/ui/link';
import {
    ArticleEditDocument as ArticleDocument,
    ArticleSettings,
    ArticleEditTitle as ArticleTitle,
} from '@/features/articles';
import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import ArticleProvider from '@/services/providers/article-provider';
import { requireOwner } from '@/utils/auth';
import { cn } from '@/utils/cn';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/$slug/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const article = queryClient.getQueryData<ArticleDocumentResponse>(
            queryKeys.articles.bySlug(params.slug),
        );

        requireOwner(
            queryClient,
            article?.author?.username ?? '',
            `/articles/${params.slug}`,
        );
    },
    head: () =>
        generateHeadMeta({
            title: 'Редагувати статтю',
            robots: { index: false },
        }),
    component: ArticleUpdatePage,
});

function ArticleUpdatePage() {
    const { slug } = Route.useParams();
    const { data: article } = useArticleBySlug({ slug });

    if (!article) return null;

    return (
        <>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <div
                        className={cn(
                            'size-2 rounded-full',
                            article.draft
                                ? 'bg-warning-foreground'
                                : 'bg-success-foreground',
                        )}
                    />
                    <Link
                        to={`${CONTENT_TYPE_LINKS['article']}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {article?.title}
                    </Link>
                </div>
            </Breadcrumbs>
            <ArticleProvider
                initialState={{
                    ...article,
                    document: article.document,
                    tags: article.tags.map((tag: { name: string }) => tag.name),
                }}
            >
                <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-12 lg:grid-cols-[1fr_25%]">
                    <Block>
                        <ArticleTitle />
                        <Card className="flex w-full p-0 md:hidden">
                            <ArticleSettings />
                        </Card>
                        <ArticleDocument />
                    </Block>
                    <Card className="bg-secondary/20 sticky top-20 order-1 hidden w-full self-start p-0 backdrop-blur-xl md:flex">
                        <ArticleSettings />
                    </Card>
                </div>
            </ArticleProvider>
        </>
    );
}
