import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { Franchise } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/novel/$slug/franchise')({
    head: () => generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: NovelFranchisePage,
});

function NovelFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.NOVEL}
                />
                <Franchise content_type={ContentTypeEnum.NOVEL} extended />
            </div>
        </div>
    );
}
