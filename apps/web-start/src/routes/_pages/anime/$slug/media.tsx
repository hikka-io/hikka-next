import { createFileRoute } from '@tanstack/react-router';

import { ContentMedia as Media } from '@/features/content';

export const Route = createFileRoute('/_pages/anime/$slug/media')({
    head: () => ({
        meta: [{ title: 'Медіа' }],
    }),
    component: AnimeMediaPage,
});

function AnimeMediaPage() {
    return (
        <div className="flex flex-col gap-12">
            <Media extended />
        </div>
    );
}
