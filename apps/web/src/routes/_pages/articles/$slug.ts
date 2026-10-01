import { createFileRoute } from '@tanstack/react-router';

import { type ArticleCategoryEnum, getArticleOptions } from '@hikka/api';

import { ensureOr404 } from '@/utils/api/ensure-or-404';
import { ARTICLE_CATEGORY } from '@/utils/labels/enum-labels';
import { generateHeadMeta } from '@/utils/metadata';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/articles/$slug')({
    loader: async ({ params, context: { queryClient, apiClient } }) => {
        const { slug } = params;

        const article = await ensureOr404(() =>
            queryClient.ensureQueryData(
                getArticleOptions({ path: { slug }, client: apiClient }),
            ),
        );

        return { article };
    },
    head: ({ loaderData }) => {
        const article = loaderData?.article;
        if (!article) return generateHeadMeta({ title: 'Статті' });

        const categoryTitle =
            ARTICLE_CATEGORY[article.category as ArticleCategoryEnum]
                ?.title_ua || '';

        return generateHeadMeta({
            title: `${article.title} / ${categoryTitle}`,
            keywords: article.tags?.map((tag) => tag.name).join(', '),
            openGraph: {
                type: 'article',
                authors: [article.author.username ?? ''],
            },
            url: `${SITE_ORIGIN}/articles/${article.slug}`,
            canonical: `${SITE_ORIGIN}/articles/${article.slug}`,
        });
    },
});
