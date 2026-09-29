import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { CharacterAnime } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/anime')({
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
