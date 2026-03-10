import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentStaff as Staff } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';

export const Route = createFileRoute('/_pages/anime/$slug/staff')({
    head: () => ({
        meta: [{ title: 'Автори' }],
    }),
    component: AnimeStaffPage,
});

function AnimeStaffPage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.ANIME}
                />
                <Staff extended content_type={ContentTypeEnum.ANIME} />
            </div>
        </div>
    );
}
