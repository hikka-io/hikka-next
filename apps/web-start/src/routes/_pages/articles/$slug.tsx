import { ContentTypeEnum } from '@hikka/client';
import { articleBySlugOptions } from '@hikka/react/options';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

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
    head: ({ loaderData }) => ({
        meta: [
            {
                title: loaderData?.article?.title
                    ? `${loaderData.article.title} / Hikka`
                    : 'Статті / Hikka',
            },
        ],
    }),
    component: ArticleSlugLayout,
});

function ArticleSlugLayout() {
    return <Outlet />;
}
