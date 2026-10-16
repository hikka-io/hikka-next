import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, FranchisePage } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';
import { franchiseSearchSchema } from '@/utils/search-schemas';

export const Route = createFileRoute('/_pages/novel/$slug/franchise')({
    validateSearch: zodValidator(franchiseSearchSchema),
    loader: ({ params, context }) =>
        loadContentTab(
            ContentTypeEnum.NOVEL,
            'franchise',
            params.slug,
            context,
        ),
    head: () =>
        generateHeadMeta({ title: 'Франшиза', robots: { index: false } }),
    component: NovelFranchiseRoute,
});

function NovelFranchiseRoute() {
    const { slug } = Route.useParams();
    const { view, order } = Route.useSearch();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.NOVEL}>
            <FranchisePage
                content_type={ContentTypeEnum.NOVEL}
                slug={slug}
                view={view}
                order={order}
            />
        </ContentSubpage>
    );
}
