import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentStaff as Staff } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/manga/$slug/staff')({
    head: () => generateHeadMeta({ title: 'Автори', robots: { index: false } }),
    component: MangaStaffPage,
});

function MangaStaffPage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.MANGA}
                />
                <Staff extended content_type={ContentTypeEnum.MANGA} />
            </div>
        </div>
    );
}
