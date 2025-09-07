import { ContentTypeEnum } from '@hikka/client';

import { CommentList as Comments } from '@/features/comments';
import Details from '@/features/content/details';
import {
    PersonAnime as Anime,
    PersonCharacters as Characters,
    PersonManga as Manga,
    PersonNovel as Novel,
} from '@/features/people';
import Cover from '@/features/people/cover';
import Title from '@/features/people/title';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}
const PersonPage = async (props: Props) => {
    const params = await props.params;
    const { slug } = params;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-16">
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
};

export default PersonPage;
