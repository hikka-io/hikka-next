import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { loadEntityTab } from '@/features/content/detail-route';
import { PersonAnime } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/anime')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.PERSON, 'anime', {
            slug: params.slug,
            ...context,
        }),
    head: () => generateHeadMeta({ title: 'Аніме', robots: { index: false } }),
    component: PersonAnimePage,
});

function PersonAnimePage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.PERSON}>
            <PersonAnime extended />
        </ContentSubpage>
    );
}
