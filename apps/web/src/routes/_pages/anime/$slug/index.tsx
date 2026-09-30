import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import {
    ContentDetailPage,
    ContentMedia,
    ContentMovieBanner,
} from '@/features/content';
import { loadContentOverview } from '@/features/content/detail-route';

export const Route = createFileRoute('/_pages/anime/$slug/')({
    loader: ({ params, context }) =>
        loadContentOverview(ContentTypeEnum.ANIME, params.slug, context),
    component: AnimeDetailPage,
});

function AnimeDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.ANIME}
            slug={slug}
            afterDescription={<ContentMovieBanner />}
            afterFranchise={<ContentMedia />}
        />
    );
}
