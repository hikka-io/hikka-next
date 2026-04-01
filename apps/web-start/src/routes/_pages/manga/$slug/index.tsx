import { ContentTypeEnum } from '@hikka/client';
import { useMangaBySlug } from '@hikka/react';
import { createFileRoute } from '@tanstack/react-router';

import { ContentDetailPage } from '@/features/content';

import mangaJsonSchema from '@/utils/manga-schema';

export const Route = createFileRoute('/_pages/manga/$slug/')({
    component: MangaDetailPage,
});

function MangaDetailPage() {
    const { slug } = Route.useParams();
    const { data: manga } = useMangaBySlug({ slug });

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.MANGA}
            slug={slug}
            jsonLd={
                manga ? (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(mangaJsonSchema({ manga })),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
