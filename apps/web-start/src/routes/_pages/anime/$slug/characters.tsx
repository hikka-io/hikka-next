import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentCharacters as Characters } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';

export const Route = createFileRoute('/_pages/anime/$slug/characters')({
    head: () => ({
        meta: [{ title: 'Персонажі' }],
    }),
    component: AnimeCharactersPage,
});

function AnimeCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.ANIME}
                />
                <Characters extended content_type={ContentTypeEnum.ANIME} />
            </div>
        </div>
    );
}
