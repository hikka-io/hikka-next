import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { Franchise } from '@/features/content';

export const Route = createFileRoute('/_pages/anime/$slug/franchise')({
    head: () => ({
        meta: [{ title: "Пов'язане" }],
    }),
    component: AnimeFranchisePage,
});

function AnimeFranchisePage() {
    return (
        <div className="flex flex-col gap-12">
            <Franchise content_type={ContentTypeEnum.ANIME} extended />
        </div>
    );
}
