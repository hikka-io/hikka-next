import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { ContentCharacters as Characters } from '@/features/content';

export const Route = createFileRoute('/_pages/novel/$slug/characters')({
    head: () => ({
        meta: [{ title: 'Персонажі' }],
    }),
    component: NovelCharactersPage,
});

function NovelCharactersPage() {
    return (
        <div className="flex flex-col gap-12">
            <Characters extended content_type={ContentTypeEnum.NOVEL} />
        </div>
    );
}
