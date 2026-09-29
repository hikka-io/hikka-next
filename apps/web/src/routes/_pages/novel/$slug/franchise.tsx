import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, Franchise } from '@/features/content';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/novel/$slug/franchise')({
    head: () =>
        generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: NovelFranchisePage,
});

function NovelFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.NOVEL}>
            <Franchise content_type={ContentTypeEnum.NOVEL} extended />
        </ContentSubpage>
    );
}
