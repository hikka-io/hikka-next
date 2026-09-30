import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';
import { loadContentOverview } from '@/features/content/detail-route';

export const Route = createFileRoute('/_pages/novel/$slug/')({
    loader: ({ params, context }) =>
        loadContentOverview(ContentTypeEnum.NOVEL, {
            slug: params.slug,
            ...context,
        }),
    component: NovelDetailPage,
});

function NovelDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage contentType={ContentTypeEnum.NOVEL} slug={slug} />
    );
}
