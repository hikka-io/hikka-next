import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentCharacters as Characters } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/manga/$slug/characters')({
    head: () => generateHeadMeta({ title: 'Персонажі', robots: { index: false } }),
    component: MangaCharactersPage,
});

function MangaCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
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
