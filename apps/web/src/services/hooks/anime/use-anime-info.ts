import { QueryKey, useQuery } from '@tanstack/react-query';

import { convertTitle } from '../../../utils/adapters/convert-title';
import getQueryClient from '../../../utils/get-query-client';
import getAnimeInfo, { Params } from '../../api/anime/getAnimeInfo';
import { useSettingsContext } from '../../providers/settings-provider';

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
