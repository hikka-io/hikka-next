import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { PersonNovel } from '@/features/entities';
import { loadEntityTab } from '@/features/entities/queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/novel')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.PERSON, 'novel', {
            slug: params.slug,
            ...context,
        }),
    head: () => generateHeadMeta({ title: 'Ранобе', robots: { index: false } }),
    component: PersonNovelPage,
});

function PersonNovelPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.PERSON}>
            <PersonNovel extended />
        </ContentSubpage>
    );
}
