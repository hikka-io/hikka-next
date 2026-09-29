import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum, novelInfoOptions } from '@hikka/api';

import JsonLd from '@/components/json-ld';
import { ContentDetailPage } from '@/features/content';
import { contentJsonLd } from '@/utils/json-ld';

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
                    <JsonLd
                        data={contentJsonLd({
                            content: novel,
                            contentType: 'novel',
                        })}
                    />
                ) : undefined
            }
        />
    );
}
