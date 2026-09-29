import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentCharacters, ContentSubpage } from '@/features/content';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/characters')({
    head: () =>
        generateHeadMeta({ title: 'Персонажі', robots: { index: false } }),
    component: AnimeCharactersPage,
});

function AnimeCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.ANIME}>
            <ContentCharacters extended content_type={ContentTypeEnum.ANIME} />
        </ContentSubpage>
    );
}
