import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { CharacterAnime as Anime } from '@/features/characters';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/anime')({
    head: () => generateHeadMeta({ title: 'Аніме', robots: { index: false } }),
    component: CharacterAnimePage,
});

function CharacterAnimePage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.CHARACTER}
                />
                <Anime extended />
            </div>
        </div>
    );
}
