import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';

export const Route = createFileRoute('/_pages/novel/$slug/')({
    component: NovelDetailPage,
});

function NovelDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage contentType={ContentTypeEnum.NOVEL} slug={slug} />
    );
}
