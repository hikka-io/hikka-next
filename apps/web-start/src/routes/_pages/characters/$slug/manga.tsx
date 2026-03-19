import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { CharacterManga as Manga } from '@/features/characters';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/manga')({
    head: () => generateHeadMeta({ title: 'Манґа', robots: { index: false } }),
    component: CharacterMangaPage,
});

function CharacterMangaPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.CHARACTER}
                />
                <Manga extended />
            </div>
        </div>
    );
}
