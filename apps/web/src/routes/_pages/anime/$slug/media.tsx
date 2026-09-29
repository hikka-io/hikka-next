import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentMedia, ContentSubpage } from '@/features/content';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/media')({
    head: () => generateHeadMeta({ title: 'Медіа', robots: { index: false } }),
    component: AnimeMediaPage,
});

function AnimeMediaPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.ANIME}>
            <ContentMedia extended />
        </ContentSubpage>
    );
}
