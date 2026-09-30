import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { loadEntityTab } from '@/features/content/detail-route';
import { CharacterVoices } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/voices')({
    loader: ({ params, context }) =>
        loadEntityTab(ContentTypeEnum.CHARACTER, 'voices', {
            slug: params.slug,
            ...context,
        }),
    head: () => generateHeadMeta({ title: 'Сейю', robots: { index: false } }),
    component: CharacterVoicesPage,
});

function CharacterVoicesPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.CHARACTER}>
            <CharacterVoices extended />
        </ContentSubpage>
    );
}
