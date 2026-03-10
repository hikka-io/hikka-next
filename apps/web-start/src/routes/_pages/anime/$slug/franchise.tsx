import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { Franchise } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';

export const Route = createFileRoute('/_pages/anime/$slug/franchise')({
    head: () => ({
        meta: [{ title: "Пов'язане" }],
    }),
    component: AnimeFranchisePage,
});

function AnimeFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
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
