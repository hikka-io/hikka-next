import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { CharacterAnime } from '@/features/entities';
import { loadEntityTab } from '@/features/entities/queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/anime')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.CHARACTER, 'anime', params.slug, context),
    head: () => generateHeadMeta({ title: 'Аніме', robots: { index: false } }),
    component: CharacterAnimePage,
});

function CharacterAnimePage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.CHARACTER}>
            <CharacterAnime extended />
        </ContentSubpage>
    );
}
