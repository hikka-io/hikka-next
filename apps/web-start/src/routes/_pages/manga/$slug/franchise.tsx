import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { Franchise } from '@/features/content';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/manga/$slug/franchise')({
    head: () => generateHeadMeta({ title: "Пов'язане", robots: { index: false } }),
    component: MangaFranchisePage,
});

function MangaFranchisePage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.MANGA}
                />
                <Franchise content_type={ContentTypeEnum.MANGA} extended />
            </div>
        </div>
    );
}
