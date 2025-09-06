import { ContentTypeEnum } from '@hikka/client';

import {
    CharacterAnime as Anime,
    CharacterDescription as Description,
    CharacterManga as Manga,
    CharacterNovel as Novel,
    CharacterVoices as Voices,
} from '@/features/characters';
import { CommentList as Comments } from '@/features/comments';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

const CharacterPage = async (props: Props) => {
    const params = await props.params;
    const { slug } = params;

    return (
        <div className="relative flex flex-col gap-12 ">
            <Description />
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
    );
};

export default CharacterPage;
