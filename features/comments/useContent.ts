import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import getCharacterInfo from '@/services/api/characters/getCharacterInfo';
import getCollection from '@/services/api/collections/getCollection';
import getEdit from '@/services/api/edit/getEdit';
import getMangaInfo from '@/services/api/manga/getMangaInfo';
import getNovelInfo from '@/services/api/novel/getNovelInfo';
import getPersonInfo from '@/services/api/people/getPersonInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';

interface Props {
    content_type: API.ContentType;
    slug: string;
}

interface Response {
    title: string;
    image: string;
    content_type: API.ContentType;
}

export const getContent = ({ content_type, slug }: Props) => {
    switch (content_type) {
        case 'anime':
            return getAnimeInfo({ params: { slug } });
        case 'manga':
            return getMangaInfo({ params: { slug } });
        case 'novel':
            return getNovelInfo({ params: { slug } });
        case 'character':
            return getCharacterInfo({ params: { slug } });
        case 'person':
            return getPersonInfo({ params: { slug } });
        case 'collection':
            return getCollection({ params: { reference: slug } });
        case 'edit':
            return getEdit({ params: { edit_id: Number(slug) } });
        default:
            return getAnimeInfo({ params: { slug } });
    }
};

const useContent = ({ slug, content_type }: Props) => {
    const { titleLanguage } = useSettingsContext();

    const query = useQuery({
        queryKey: ['content', content_type, slug],
        queryFn: async () => getContent({ content_type, slug }),
        select: (data) => {
            let content: Response | undefined;

            if ('data_type' in data) {
                if (data.data_type === 'anime') {
                    content = {
                        title:
                            data[titleLanguage!] ||
                            data.title_ua ||
                            data.title_en ||
                            data.title_ja,
                        image: data.poster,
                        content_type,
                    };
                }

                if (data.data_type === 'manga' || data.data_type === 'novel') {
                    content = {
                        title:
                            data[
                                titleLanguage === 'title_ja'
                                    ? 'title_original'
                                    : titleLanguage!
                            ] ||
                            data.title_ua ||
                            data.title_en,
                        image: data.image,
                        content_type,
                    };
                }

                if (data.data_type === 'character') {
                    content = {
                        title: data.name_ua || data.name_en || data.name_ja,
                        image: data.image,
                        content_type,
                    };
                }

                if (data.data_type === 'person') {
                    content = {
                        title: data.name_ua || data.name_en || data.name_native,
                        image: data.image,
                        content_type,
                    };
                }

                if (data.data_type === 'collection') {
                    content = {
                        title: data.title,
                        image:
                            data.collection[0].content.data_type === 'anime'
                                ? data.collection[0].content.poster
                                : data.collection[0].content.image,
                        content_type,
                    };
                }
            } else {
                content = {
                    title: `Правка #${data.edit_id}`,
                    image:
                        data.content.data_type === 'anime'
                            ? data.content.poster
                            : data.content.image,
                    content_type,
                };
            }

            return content;
        },
    });

    return query;
};

export default useContent;
