import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { loadEntityTab } from '@/features/content/detail-route';
import { PersonCharacters } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/characters')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.PERSON, 'voices', {
            slug: params.slug,
            ...context,
        }),
    head: () =>
        generateHeadMeta({ title: 'Персонажі', robots: { index: false } }),
    component: PersonCharactersPage,
});

function PersonCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.PERSON}>
            <PersonCharacters extended />
        </ContentSubpage>
    );
}
