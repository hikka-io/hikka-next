import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentStaff as Staff } from '@/features/content';

export const Route = createFileRoute('/_pages/novel/$slug/staff')({
    head: () => ({
        meta: [{ title: 'Автори' }],
    }),
    component: NovelStaffPage,
});

function NovelStaffPage() {
    return (
        <div className="flex flex-col gap-12">
            <Staff extended content_type={ContentTypeEnum.NOVEL} />
        </div>
    );
}
