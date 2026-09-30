import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, Franchise } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/manga/$slug/franchise')({
    loader: ({ params, context }) =>
        loadContentTab(ContentTypeEnum.MANGA, 'franchise', {
            slug: params.slug,
            ...context,
        }),
    head: () =>
        generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: MangaFranchisePage,
});

function MangaFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.MANGA}>
            <Franchise content_type={ContentTypeEnum.MANGA} extended />
        </ContentSubpage>
    );
}
