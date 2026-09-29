import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage } from '@/features/content';
import { CharacterNovel } from '@/features/entities';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/novel')({
    head: () => generateHeadMeta({ title: 'Ранобе', robots: { index: false } }),
    component: CharacterNovelPage,
});

function CharacterNovelPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.CHARACTER}>
            <CharacterNovel extended />
        </ContentSubpage>
    );
}
