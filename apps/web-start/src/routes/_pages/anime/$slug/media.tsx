import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { ContentMedia as Media } from '@/features/content';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/anime/$slug/media')({
    head: () => generateHeadMeta({ title: 'Медіа', robots: { index: false } }),
    component: AnimeMediaPage,
});

function AnimeMediaPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.ANIME}
                />
                <Media extended />
            </div>
        </div>
    );
}
