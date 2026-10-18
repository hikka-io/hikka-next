import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { FranchisePage } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';
import { franchiseSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/anime/$slug/franchise')({
    validateSearch: zodValidator(franchiseSearchSchema),
    loader: ({ params, context }) =>
        loadContentTab(
            ContentTypeEnum.ANIME,
            'franchise',
            params.slug,
            context,
        ),
    head: () =>
        generateHeadMeta({ title: 'Франшиза', robots: { index: false } }),
    component: AnimeFranchiseRoute,
});

function AnimeFranchiseRoute() {
    const { slug } = Route.useParams();
    const { view, order, types } = Route.useSearch();

    return (
        <FranchisePage
            content_type={ContentTypeEnum.ANIME}
            slug={slug}
            view={view}
            order={order}
            types={types}
        />
    );
}
