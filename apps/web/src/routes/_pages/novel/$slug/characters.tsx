import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentCharacters, ContentSubpage } from '@/features/content';
import { loadContentTab } from '@/features/content/detail-route';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/novel/$slug/characters')({
    loader: ({ params, context }) =>
        loadContentTab(
            ContentTypeEnum.NOVEL,
            'characters',
            params.slug,
            context,
        ),
    head: () =>
        generateHeadMeta({ title: 'Персонажі', robots: { index: false } }),
    component: NovelCharactersPage,
});

function NovelCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.NOVEL}>
            <ContentCharacters extended content_type={ContentTypeEnum.NOVEL} />
        </ContentSubpage>
    );
}
