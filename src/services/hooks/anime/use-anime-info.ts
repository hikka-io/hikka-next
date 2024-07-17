import { QueryKey, useQuery } from '@tanstack/react-query';

import getAnimeInfo, { Params } from '@/services/api/anime/getAnimeInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => ['anime', params.slug];

const useAnimeInfo = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getAnimeInfo({
                params,
            }),
        ...options,
        select: (data) =>
            convertTitle({
                titleLanguage: titleLanguage!,
                data: data,
            }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchAnimeInfo = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getAnimeInfo({
                params,
            }),
    });
};

export default useAnimeInfo;
