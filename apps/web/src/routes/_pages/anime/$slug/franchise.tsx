import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { ContentSubpage, Franchise } from '@/features/content';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/franchise')({
    head: () =>
        generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: AnimeFranchisePage,
});

function AnimeFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <ContentSubpage slug={slug} contentType={ContentTypeEnum.ANIME}>
            <Franchise content_type={ContentTypeEnum.ANIME} extended />
        </ContentSubpage>
    );
}
