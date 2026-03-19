import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { PersonNovel as Novel } from '@/features/people';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/novel')({
    head: () => generateHeadMeta({ title: 'Ранобе', robots: { index: false } }),
    component: PersonNovelPage,
});

function PersonNovelPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.PERSON}
                />
                <Novel extended />
            </div>
        </div>
    );
}
