import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { CharacterVoices as Voices } from '@/features/characters';
import ContentHeader from '@/features/comments/content-header';
import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/characters/$slug/voices')({
    head: () => generateHeadMeta({ title: 'Сейю', robots: { index: false } }),
    component: CharacterVoicesPage,
});

function CharacterVoicesPage() {
    const { slug } = Route.useParams();

    return (
        <div className="w-full mx-auto flex max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.CHARACTER}
                />
                <Voices extended />
            </div>
        </div>
    );
}
