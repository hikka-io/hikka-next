import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentStaff as Staff } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/novel/$slug/staff')({
    head: () => generateHeadMeta({ title: 'Автори', robots: { index: false } }),
    component: NovelStaffPage,
});

function NovelStaffPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.NOVEL}
                />
                <Staff extended content_type={ContentTypeEnum.NOVEL} />
            </div>
        </div>
    );
}
