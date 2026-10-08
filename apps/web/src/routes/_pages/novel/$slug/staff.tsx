import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentStaff, ContentSubpage } from '@/features/content';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/novel/$slug/staff')({
    head: () => generateHeadMeta({ title: 'Автори', robots: { index: false } }),
    component: NovelStaffPage,
});

function NovelStaffPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.NOVEL}>
            <ContentStaff extended content_type={ContentTypeEnum.NOVEL} />
        </ContentSubpage>
    );
}
