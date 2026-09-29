import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { CharacterVoices } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/voices')({
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
