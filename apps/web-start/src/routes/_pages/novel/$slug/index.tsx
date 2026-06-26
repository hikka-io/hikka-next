import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, novelInfoOptions } from '@hikka/api';

import { ContentDetailPage } from '@/features/content';
import novelJsonSchema from '@/utils/novel-schema';

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
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD structured data, no user input.
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(
                            // TODO(phase2): drop cast once novel-schema reads @hikka/api types
                            novelJsonSchema({
                                novel: novel as unknown as Parameters<
                                    typeof novelJsonSchema
                                >[0]['novel'],
                            }),
                        ),
                        }}
                    />
                ) : undefined
            }
        />
    );
}
