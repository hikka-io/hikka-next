import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import {
    ContentDetailPage,
    ContentMedia,
    ContentMovieBanner,
} from '@/features/content';

export const Route = createFileRoute('/_pages/anime/$slug/')({
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
