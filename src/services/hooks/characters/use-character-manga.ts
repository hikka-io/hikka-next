import { QueryKey } from '@tanstack/react-query';

import getCharacterManga, {
    Params,
} from '@/services/api/characters/getCharacterManga';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => [
    'character-manga',
    params.slug,
];

const useCharacterManga = (props: Params) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCharacterManga({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    manga: convertTitle<API.Manga>({
                        data: ch.manga,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchCharacterManga = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCharacterManga({
                params,
                page: pageParam,
            }),
    });
};

export default useCharacterManga;
