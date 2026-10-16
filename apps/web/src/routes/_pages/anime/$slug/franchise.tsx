import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, FranchisePage } from '@/features/content';
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
    const { view } = Route.useSearch();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.ANIME}>
            <FranchisePage
                content_type={ContentTypeEnum.ANIME}
                slug={slug}
                view={view}
            />
        </ContentSubpage>
    );
}
