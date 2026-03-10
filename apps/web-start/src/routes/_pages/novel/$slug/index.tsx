import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentDetailPage } from '@/features/content';

export const Route = createFileRoute('/_pages/novel/$slug/')({
    component: NovelDetailPage,
});

function NovelDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.NOVEL}
            slug={slug}
        />
    );
}
