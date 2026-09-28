import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, novelInfoOptions } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';
import contentJsonSchema from '@/utils/content-schema';
import { serializeJsonLd } from '@/utils/json-ld';

export const Route = createFileRoute('/_pages/novel/$slug/')({
    component: NovelDetailPage,
});

function NovelDetailPage() {
    const { slug } = Route.useParams();
    const { data: novel } = useQuery(novelInfoOptions({ path: { slug } }));

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.NOVEL}
            slug={slug}
            jsonLd={
                novel ? (
                    <script
                        type="application/ld+json"
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: user-editable JSON-LD, escaped by serializeJsonLd so it cannot close the script tag.
                        dangerouslySetInnerHTML={{
                            __html: serializeJsonLd(
                                contentJsonSchema({
                                    content: novel,
                                    contentType: 'novel',
                                }),
                            ),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
