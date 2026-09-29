import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';

export const Route = createFileRoute('/_pages/manga/$slug/')({
    component: MangaDetailPage,
});

function MangaDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage contentType={ContentTypeEnum.MANGA} slug={slug} />
    );
}
