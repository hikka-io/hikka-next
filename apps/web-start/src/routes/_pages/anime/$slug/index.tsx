import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { MovieBanner } from '@/features/anime';
import { ContentDetailPage, ContentMedia as Media } from '@/features/content';

export const Route = createFileRoute('/_pages/anime/$slug/')({
    component: AnimeDetailPage,
});

function AnimeDetailPage() {
    const { slug } = Route.useParams();

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.ANIME}
            slug={slug}
            afterDescription={<MovieBanner />}
            afterFranchise={<Media />}
        />
    );
}
