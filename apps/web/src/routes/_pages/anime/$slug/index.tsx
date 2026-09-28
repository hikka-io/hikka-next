import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { animeSlugOptions, ContentTypeEnum } from '@hikka/api';

import { MovieBanner } from '@/features/anime';
import { ContentDetailPage, ContentMedia as Media } from '@/features/content';
import contentJsonSchema from '@/utils/content-schema';
import { serializeJsonLd } from '@/utils/json-ld';

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
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: user-editable JSON-LD, escaped by serializeJsonLd so it cannot close the script tag.
                        dangerouslySetInnerHTML={{
                            __html: serializeJsonLd(
                                contentJsonSchema({
                                    content: anime,
                                    contentType: 'anime',
                                }),
                            ),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
