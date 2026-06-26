import type { ComponentProps } from 'react';

import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { CommentList as Comments } from '@/features/comments';
import { ContentDetails as Details } from '@/features/content';
import {
    CharacterAnime as Anime,
    CharacterCover as Cover,
    CharacterDescription as Description,
    CharacterManga as Manga,
    CharacterNovel as Novel,
    CharacterTitle as Title,
    CharacterVoices as Voices,
} from '@/features/entities';

export const Route = createFileRoute('/_pages/characters/$slug/')({
    component: CharacterDetailPage,
});

function CharacterDetailPage() {
    const { slug } = Route.useParams();

    // TODO(phase2): drop cast
    const detailsContentType = ContentTypeEnum.CHARACTER as ComponentProps<
        typeof Details
    >['content_type'];

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title />
                <Description />
                <Details className="lg:hidden" content_type={detailsContentType} />
                <Anime />
                <Manga />
                <Novel />
                <Voices />
                <Comments
                    preview
                    slug={slug}
                    content_type={ContentTypeEnum.CHARACTER}
                />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details
                    className="hidden lg:flex"
                    content_type={detailsContentType}
                />
            </div>
        </div>
    );
}
