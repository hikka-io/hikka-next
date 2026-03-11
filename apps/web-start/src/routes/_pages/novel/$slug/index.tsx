import { ContentTypeEnum } from '@hikka/client';
import { useNovelBySlug } from '@hikka/react';
import { createFileRoute } from '@tanstack/react-router';

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
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(novelJsonSchema({ novel })),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
