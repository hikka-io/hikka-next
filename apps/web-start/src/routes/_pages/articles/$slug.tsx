import { articleBySlugOptions } from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

import { ARTICLE_CATEGORY_OPTIONS } from '@/utils/constants/common';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/$slug')({
    loader: async ({
        params,
        context: { queryClient, hikkaClient },
    }) => {
        const { slug } = params;

        const article = await queryClient.ensureQueryData(
            articleBySlugOptions(hikkaClient, { slug }),
        );

        if (!article) throw redirect({ to: '/articles' });

        return { article };
    },
    head: ({ loaderData }) => {
        const article = loaderData?.article;
        if (!article) return generateHeadMeta({ title: 'Статті' });

        const categoryTitle =
            ARTICLE_CATEGORY_OPTIONS[article.category]?.title_ua || '';

        return generateHeadMeta({
            title: `${article.title} / ${categoryTitle}`,
            keywords: article.tags?.map((tag: any) => tag.name).join(', '),
            openGraph: {
                type: 'article',
                authors: [article.author.username],
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
