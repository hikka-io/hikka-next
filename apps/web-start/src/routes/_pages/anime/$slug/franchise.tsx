import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { Franchise } from '@/features/content';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/franchise')({
    head: () =>
        generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: AnimeFranchisePage,
});

function AnimeFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.ANIME}
                />
                <Franchise content_type={ContentTypeEnum.ANIME} extended />
            </div>
        </div>
    );
}
