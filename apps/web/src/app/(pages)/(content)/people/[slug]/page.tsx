import { ContentTypeEnum } from '@hikka/client';

import { CommentList as Comments } from '@/features/comments';
import {
    PersonAnime as Anime,
    PersonCharacters as Characters,
    PersonManga as Manga,
    PersonNovel as Novel,
} from '@/features/people';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}
const PersonPage = async (props: Props) => {
    const params = await props.params;
    const { slug } = params;

    return (
        <div className="relative flex flex-col gap-12 ">
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
    );
};

export default PersonPage;
