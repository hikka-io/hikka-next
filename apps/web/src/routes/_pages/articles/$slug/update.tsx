import { createFileRoute } from '@tanstack/react-router';

import { getArticleOptions } from '@hikka/api';

import { ArticleEditorPage } from '@/features/articles';
import { retryOnCancel } from '@/utils/api/retry-on-cancel';
import { requireOwner } from '@/utils/auth';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/articles/$slug/update')({
    beforeLoad: async ({ params, context: { queryClient, apiClient } }) => {
        const article = await retryOnCancel(() =>
            queryClient.ensureQueryData(
                getArticleOptions({
                    path: { slug: params.slug },
                    client: apiClient,
                }),
            ),
        ).catch(() => undefined);

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

    return <ArticleEditorPage slug={slug} />;
}
