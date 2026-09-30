import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, Franchise } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/franchise')({
    loader: ({ params, context }) =>
        loadContentTab(ContentTypeEnum.ANIME, 'franchise', {
            slug: params.slug,
            ...context,
        }),
    head: () =>
        generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: AnimeFranchisePage,
});

function AnimeFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.ANIME}>
            <Franchise content_type={ContentTypeEnum.ANIME} extended />
        </ContentSubpage>
    );
}
