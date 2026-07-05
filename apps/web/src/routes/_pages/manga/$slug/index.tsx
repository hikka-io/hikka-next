import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, mangaInfoOptions } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';
import contentJsonSchema from '@/utils/content-schema';

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
                    <script
                        type="application/ld+json"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data, no user input.
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(
                                contentJsonSchema({
                                    content: manga,
                                    contentType: 'manga',
                                }),
                            ),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
