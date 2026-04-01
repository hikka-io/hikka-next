import { ContentTypeEnum } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import { CommentList as Comments } from '@/features/comments';
import { ContentDetails as Details } from '@/features/content';
import {
    PersonAnime as Anime,
    PersonCharacters as Characters,
    PersonCover as Cover,
    PersonManga as Manga,
    PersonNovel as Novel,
    PersonTitle as Title,
} from '@/features/people';

export const Route = createFileRoute('/_pages/people/$slug/')({
    component: PersonDetailPage,
});

function PersonDetailPage() {
    const { slug } = Route.useParams();

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title />
                <Details
                    className="lg:hidden"
                    content_type={ContentTypeEnum.PERSON}
                />
                <Characters />
                <Anime />
                <Manga />
                <Novel />
                <Comments
                    preview
                    slug={slug}
                    content_type={ContentTypeEnum.PERSON}
                />
            </div>
            <div className="flex flex-col gap-12 lg:col-span-1">
                <Details
                    className="hidden lg:flex"
                    content_type={ContentTypeEnum.PERSON}
                />
            </div>
        </div>
    );
}
