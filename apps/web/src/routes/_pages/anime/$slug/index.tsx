import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { animeSlugOptions, ContentTypeEnum } from '@hikka/api';

import JsonLd from '@/components/json-ld';
import {
    ContentDetailPage,
    ContentMedia,
    ContentMovieBanner,
} from '@/features/content';
import { contentJsonLd } from '@/utils/json-ld';

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
            afterDescription={<ContentMovieBanner />}
            afterFranchise={<ContentMedia />}
            jsonLd={
                anime ? (
                    <JsonLd
                        data={contentJsonLd({
                            content: anime,
                            contentType: 'anime',
                        })}
                    />
                ) : undefined
            }
        />
    );
}
