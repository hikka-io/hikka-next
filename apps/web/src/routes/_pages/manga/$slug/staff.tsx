import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentStaff, ContentSubpage } from '@/features/content';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/manga/$slug/staff')({
    head: () => generateHeadMeta({ title: 'Автори', robots: { index: false } }),
    component: MangaStaffPage,
});

function MangaStaffPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.MANGA}>
            <ContentStaff extended content_type={ContentTypeEnum.MANGA} />
        </ContentSubpage>
    );
}
