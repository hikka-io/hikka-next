import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentStaff, ContentSubpage } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/staff')({
    loader: ({ params, context }) =>
        loadContentTab(ContentTypeEnum.ANIME, 'staff', {
            slug: params.slug,
            ...context,
        }),
    head: () => generateHeadMeta({ title: 'Автори', robots: { index: false } }),
    component: AnimeStaffPage,
});

function AnimeStaffPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.ANIME}>
            <ContentStaff extended content_type={ContentTypeEnum.ANIME} />
        </ContentSubpage>
    );
}
