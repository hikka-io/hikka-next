import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { PersonManga } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/manga')({
    head: () => generateHeadMeta({ title: 'Манґа', robots: { index: false } }),
    component: PersonMangaPage,
});

function PersonMangaPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.PERSON}>
            <PersonManga extended />
        </ContentSubpage>
    );
}
