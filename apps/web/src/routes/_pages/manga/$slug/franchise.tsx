import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, FranchisePage } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';
import { franchiseSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/manga/$slug/franchise')({
    validateSearch: zodValidator(franchiseSearchSchema),
    loader: ({ params, context }) =>
        loadContentTab(
            ContentTypeEnum.MANGA,
            'franchise',
            params.slug,
            context,
        ),
    head: () =>
        generateHeadMeta({ title: 'Франшиза', robots: { index: false } }),
    component: MangaFranchiseRoute,
});

function MangaFranchiseRoute() {
    const { slug } = Route.useParams();
    const { view, order } = Route.useSearch();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.MANGA}>
            <FranchisePage
                content_type={ContentTypeEnum.MANGA}
                slug={slug}
                view={view}
                order={order}
            />
        </ContentSubpage>
    );
}
