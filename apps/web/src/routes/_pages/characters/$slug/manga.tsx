import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { CharacterManga } from '@/features/entities';
import { loadEntityTab } from '@/features/entities/queries';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/manga')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.CHARACTER, 'manga', {
            slug: params.slug,
            ...context,
        }),
    head: () => generateHeadMeta({ title: 'Манґа', robots: { index: false } }),
    component: CharacterMangaPage,
});

function CharacterMangaPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.CHARACTER}>
            <CharacterManga extended />
        </ContentSubpage>
    );
}
