import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { PersonAnime as Anime } from '@/features/people';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/anime')({
    head: () => generateHeadMeta({ title: 'Аніме', robots: { index: false } }),
    component: PersonAnimePage,
});

function PersonAnimePage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.PERSON}
                />
                <Anime extended />
            </div>
        </div>
    );
}
