import { createFileRoute } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { CommentList as Comments } from '@/features/comments';
import { Collections, ContentDetails as Details } from '@/features/content';
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

    const detailsContentType = ContentTypeEnum.CHARACTER;

    return (
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-4">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover />
            </div>
            <div className="contents lg:col-span-2 lg:flex lg:flex-col lg:gap-8">
                <Title />
                <Description />
                <Details
                    className="lg:hidden"
                    content_type={detailsContentType}
                />
                <Anime />
                <Manga />
                <Novel />
                <Voices />
                <div className="order-last lg:order-0">
                    <Comments
                        preview
                        slug={slug}
                        content_type={ContentTypeEnum.CHARACTER}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-8 lg:col-span-1">
                <Details
                    className="hidden lg:flex"
                    content_type={detailsContentType}
                />
                <Collections content_type={ContentTypeEnum.CHARACTER} />
            </div>
        </div>
    );
}
