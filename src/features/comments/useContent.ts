import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';
import getCharacterInfo from '@/services/api/characters/getCharacterInfo';
import getCollection from '@/services/api/collections/getCollection';
import getEdit from '@/services/api/edit/getEdit';
import getMangaInfo from '@/services/api/manga/getMangaInfo';
import getNovelInfo from '@/services/api/novel/getNovelInfo';
import getPersonInfo from '@/services/api/people/getPersonInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

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

export const paramsBuilder = (props: Props): Props => ({
    slug: props.slug,
    content_type: props.content_type,
});

export const key = (props: Props) => [
    'content',
    props.content_type,
    props.slug,
];

const useContent = (props: Props) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    const query = useQuery({
        queryKey: key(params),
        queryFn: async () => getContent(params),
        select: (data) => {
            let content: Response | undefined;

            if ('data_type' in data) {
                if (data.data_type === 'collection') {
                    content = {
                        title: data.title,
                        image:
                            data.collection[0].content.data_type === 'anime'
                                ? data.collection[0].content.image
                                : data.collection[0].content.image,
                        content_type: params.content_type,
                    };
                } else {
                    content = {
                        image: data.image,
                        content_type: params.content_type,
                        title: convertTitle({
                            data,
                            titleLanguage: titleLanguage!,
                        }).title,
                    };
                }
            } else {
                content = {
                    title: `Правка #${data.edit_id}`,
                    image:
                        data.content.data_type === 'anime'
                            ? data.content.image
                            : data.content.image,
                    content_type: params.content_type,
                };
            }

            return content;
        },
    });

    return query;
};

export const prefetchContent = (props: Props) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: async () => getContent(params),
    });
};

export default useContent;
