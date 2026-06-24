import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/client';
import { useNovelBySlug } from '@hikka/react';

import { ContentDetailPage } from '@/features/content';
import novelJsonSchema from '@/utils/novel-schema';

export const Route = createFileRoute('/_pages/novel/$slug/')({
    component: NovelDetailPage,
});

function NovelDetailPage() {
    const { slug } = Route.useParams();
    const { data: novel } = useNovelBySlug({ slug });

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.NOVEL}
            slug={slug}
            jsonLd={
                novel ? (
                    <script
                        type="application/ld+json"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data, no user input.
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(novelJsonSchema({ novel })),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
