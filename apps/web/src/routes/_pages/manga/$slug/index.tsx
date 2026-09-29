import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, mangaInfoOptions } from '@hikka/api';

import JsonLd from '@/components/json-ld';
import { ContentDetailPage } from '@/features/content';
import { contentJsonLd } from '@/utils/json-ld';

export const Route = createFileRoute('/_pages/manga/$slug/')({
    component: MangaDetailPage,
});

function MangaDetailPage() {
    const { slug } = Route.useParams();
    const { data: manga } = useQuery(mangaInfoOptions({ path: { slug } }));

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.MANGA}
            slug={slug}
            jsonLd={
                manga ? (
                    <JsonLd
                        data={contentJsonLd({
                            content: manga,
                            contentType: 'manga',
                        })}
                    />
                ) : undefined
            }
        />
    );
}
