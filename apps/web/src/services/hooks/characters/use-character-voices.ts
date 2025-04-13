import { QueryKey } from '@tanstack/react-query';

import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';
import getCharacterVoices, {
    Params,
} from '../../api/characters/getCharacterVoices';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => [
    'character-voices',
    params.slug,
];

const useCharacterVoices = (props: Params) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCharacterVoices({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    anime: convertTitle<API.AnimeInfo>({
                        data: ch.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchCharacterVoices = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCharacterVoices({
                params,
                page: pageParam,
            }),
    });
};

export default useCharacterVoices;
