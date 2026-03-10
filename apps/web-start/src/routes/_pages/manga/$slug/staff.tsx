import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentStaff as Staff } from '@/features/content';

export const Route = createFileRoute('/_pages/manga/$slug/staff')({
    head: () => ({
        meta: [{ title: 'Автори' }],
    }),
    component: MangaStaffPage,
});

function MangaStaffPage() {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended content_type={ContentTypeEnum.MANGA} />
        </div>
    );
}
