import { QueryKey } from '@tanstack/react-query';

import getCharacterNovel, {
    Params,
} from '@/services/api/characters/getCharacterNovel';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => [
    'character-novel',
    params.slug,
];

const useCharacterNovel = (props: Params) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCharacterNovel({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    novel: convertTitle<API.Novel>({
                        data: ch.novel,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchCharacterNovel = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getCharacterNovel({
                params,
                page: pageParam,
            }),
    });
};

export default useCharacterNovel;
