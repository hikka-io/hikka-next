import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { PersonAnime } from '@/features/entities';
import { loadEntityTab } from '@/features/entities/queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/anime')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.PERSON, 'anime', params.slug, context),
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
