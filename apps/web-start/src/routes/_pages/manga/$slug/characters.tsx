import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentCharacters as Characters } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';

export const Route = createFileRoute('/_pages/manga/$slug/characters')({
    head: () => ({
        meta: [{ title: 'Персонажі' }],
    }),
    component: MangaCharactersPage,
});

function MangaCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.MANGA}
                />
                <Characters extended content_type={ContentTypeEnum.MANGA} />
            </div>
        </div>
    );
}
