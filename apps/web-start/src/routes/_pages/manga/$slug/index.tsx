import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentDetailPage } from '@/features/content';

export const Route = createFileRoute('/_pages/manga/$slug/')({
    component: MangaDetailPage,
});

function MangaDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.MANGA}
            slug={slug}
        />
    );
}
