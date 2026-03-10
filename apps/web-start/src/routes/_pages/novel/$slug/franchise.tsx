import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { Franchise } from '@/features/content';

export const Route = createFileRoute('/_pages/novel/$slug/franchise')({
    head: () => ({
        meta: [{ title: "Пов'язане" }],
    }),
    component: NovelFranchisePage,
});

function NovelFranchisePage() {
    return (
        <div className="flex flex-col gap-12">
            <Franchise content_type={ContentTypeEnum.NOVEL} extended />
        </div>
    );
}
