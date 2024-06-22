import { useQuery } from '@tanstack/react-query';

import { Params } from '@/services/api/anime/getAnimeInfo';
import getMangaInfo from '@/services/api/manga/getMangaInfo';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['manga', params.slug];

const useMangaInfo = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getMangaInfo({
                params,
            }),
        ...options,
        select: (data) =>
            convertTitle<API.MangaInfo>({
                titleLanguage: titleLanguage!,
                data: data,
            }),
        refetchOnWindowFocus: false,
    });
};

export const prefetchMangaInfo = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getMangaInfo({
                params,
            }),
    });
};

export default useMangaInfo;
