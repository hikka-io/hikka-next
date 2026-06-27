import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { animeSlugOptions, ContentTypeEnum } from '@hikka/api';

import { MovieBanner } from '@/features/anime';
import { ContentDetailPage, ContentMedia as Media } from '@/features/content';
import animeJsonSchema from '@/utils/anime-schema';

export const Route = createFileRoute('/_pages/anime/$slug/')({
    component: AnimeDetailPage,
});

function AnimeDetailPage() {
    const { slug } = Route.useParams();
    const { data: anime } = useQuery(animeSlugOptions({ path: { slug } }));

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
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data, no user input.
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(animeJsonSchema({ anime })),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
