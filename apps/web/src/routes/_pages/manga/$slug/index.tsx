import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';
import { loadContentOverview } from '@/features/content/detail-route';

export const Route = createFileRoute('/_pages/manga/$slug/')({
    loader: ({ params, context }) =>
        loadContentOverview(ContentTypeEnum.MANGA, {
            slug: params.slug,
            ...context,
        }),
    component: MangaDetailPage,
});

function MangaDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage contentType={ContentTypeEnum.MANGA} slug={slug} />
    );
}
