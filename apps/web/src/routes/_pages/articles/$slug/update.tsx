import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { Value } from 'platejs';

import {
    type ArticleDocumentResponse,
    getArticleOptions,
    getArticleQueryKey,
} from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { usePageHeader } from '@/features/app-shell';
import {
    ArticleDocumentEditor as ArticleDocument,
    ArticleSettings,
    ArticleEditTitle as ArticleTitle,
} from '@/features/articles';
import ArticleProvider from '@/services/providers/article-provider';
import type { ArticleState } from '@/services/stores/article-store';
import { requireOwner } from '@/utils/auth';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/$slug/update')({
    beforeLoad: async ({ params, context: { queryClient } }) => {
        const article = queryClient.getQueryData<ArticleDocumentResponse>(
            getArticleQueryKey({ path: { slug: params.slug } }),
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
    const { data: article } = useQuery(getArticleOptions({ path: { slug } }));

    usePageHeader({
        title: article?.title,
        subtitle: article?.draft ? 'Чернетка' : 'Опубліковано',
        indicatorClassName: article?.draft
            ? 'bg-warning-foreground'
            : 'bg-success-foreground',
        parent: `${CONTENT_TYPE_LINKS.article}/${slug}`,
    });

    if (!article) return null;

    return (
        <>
            <ArticleProvider
                initialState={
                    {
                        ...article,
                        document: article.document as Value,
                        tags: article.tags.map(
                            (tag: { name: string }) => tag.name,
                        ),
                    } as Partial<ArticleState>
                }
            >
                <div className="grid grid-cols-1 justify-center md:grid-cols-[1fr_30%] md:items-start md:justify-between md:gap-x-10 lg:grid-cols-[1fr_25%]">
                    <Block>
                        <ArticleTitle />
                        <Card className="flex w-full p-0 md:hidden">
                            <ArticleSettings />
                        </Card>
                        <ArticleDocument />
                    </Block>
                    <Card className="sticky top-20 order-1 hidden w-full self-start p-0 md:flex">
                        <ArticleSettings />
                    </Card>
                </div>
            </ArticleProvider>
        </>
    );
}
