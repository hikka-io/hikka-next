import { createFileRoute, notFound, Outlet } from '@tanstack/react-router';

import {
    type ArticleCategoryEnum,
    getArticleOptions,
    HikkaApiError,
} from '@hikka/api';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { slug } = params;

        const article = await queryClient
            .ensureQueryData(
                getArticleOptions({ path: { slug }, client: apiClient }),
            )
            .catch((error) => {
                // An unknown slug returns 404 — render the not-found page
                // instead of letting the error bubble to the 500 component.
                if (error instanceof HikkaApiError && error.status === 404) {
                    throw notFound();
                }
                throw error;
            });

        if (!article) throw notFound();

        return { article };
    },
    head: ({ loaderData }) => {
        const article = loaderData?.article;
        if (!article) return generateHeadMeta({ title: 'Статті' });

        const categoryTitle =
            ARTICLE_CATEGORY_OPTIONS[article.category as ArticleCategoryEnum]
                ?.title_ua || '';

        return generateHeadMeta({
            title: `${article.title} / ${categoryTitle}`,
            keywords: article.tags?.map((tag) => tag.name).join(', '),
            openGraph: {
                type: 'article',
                authors: [article.author.username ?? ''],
            },
            url: `https://hikka.io/articles/${article.slug}`,
            canonical: `https://hikka.io/articles/${article.slug}`,
        });
    },
    component: ArticleSlugLayout,
});

function ArticleSlugLayout() {
    return <Outlet />;
}
