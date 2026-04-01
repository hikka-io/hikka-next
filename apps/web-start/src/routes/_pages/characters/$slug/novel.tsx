import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { CharacterNovel as Novel } from '@/features/characters';
import ContentHeader from '@/features/comments/content-header';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/novel')({
    head: () => generateHeadMeta({ title: 'Ранобе', robots: { index: false } }),
    component: CharacterNovelPage,
});

function CharacterNovelPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.CHARACTER}
                />
                <Novel extended />
            </div>
        </div>
    );
}
