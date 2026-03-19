import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import ContentHeader from '@/features/comments/content-header';
import { PersonCharacters as Characters } from '@/features/people';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/$slug/characters')({
    head: () =>
        generateHeadMeta({ title: 'Персонажі', robots: { index: false } }),
    component: PersonCharactersPage,
});

function PersonCharactersPage() {
    const { slug } = Route.useParams();

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-12 p-0">
            <div className="flex flex-col gap-12">
                <ContentHeader
                    disableBreadcrumbs
                    slug={slug}
                    content_type={ContentTypeEnum.PERSON}
                />
                <Characters extended />
            </div>
        </div>
    );
}
