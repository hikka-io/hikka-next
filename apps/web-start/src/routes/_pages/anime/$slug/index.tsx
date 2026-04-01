import { ContentTypeEnum } from '@hikka/client';
import { useAnimeBySlug } from '@hikka/react';
import { createFileRoute } from '@tanstack/react-router';

import { MovieBanner } from '@/features/anime';
import { ContentDetailPage, ContentMedia as Media } from '@/features/content';

import animeJsonSchema from '@/utils/anime-schema';

export const Route = createFileRoute('/_pages/anime/$slug/')({
    component: AnimeDetailPage,
});

function AnimeDetailPage() {
    const { slug } = Route.useParams();
    const { data: anime } = useAnimeBySlug({ slug });

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.ANIME}
            slug={slug}
            afterDescription={<MovieBanner />}
            afterFranchise={<Media />}
            jsonLd={
                anime ? (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(animeJsonSchema({ anime })),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
