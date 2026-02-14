import { ContentTypeEnum } from '@hikka/client';

import {
    CharacterAnime as Anime,
    CharacterCover as Cover,
    CharacterDescription as Description,
    CharacterManga as Manga,
    CharacterNovel as Novel,
    CharacterTitle as Title,
    CharacterVoices as Voices,
} from '@/features/characters';
import { CommentList as Comments } from '@/features/comments';
import Details from '@/features/content/details';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

const CharacterPage = async (props: Props) => {
    const params = await props.params;
    const { slug } = params;

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4 lg:gap-12">
            <div className="flex flex-col gap-4 lg:col-span-1">
                <Cover />
            </div>

            <div className="flex flex-col gap-12 lg:col-span-2">
                <Title />
                <Description />
                <Details
                    className="lg:hidden"
                    content_type={ContentTypeEnum.CHARACTER}
                />
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
                    content_type={ContentTypeEnum.CHARACTER}
                />
            </div>
        </div>
    );
};

export default CharacterPage;
