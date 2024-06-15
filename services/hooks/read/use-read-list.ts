import { QueryKey } from '@tanstack/react-query';

import getReadList, { Params } from '@/services/api/read/getReadList';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertManga } from '@/utils/title-adapter';

export const paramsBuilder = ({ username, ...props }: Params): Params => ({
    username,
    read_status: props.read_status || 'watching',
    media_type: props.media_type || [],
    status: props.status || [],
    genres: props.genres || [],
    magazines: props.magazines || [],
    sort: props.sort || ['read_score:desc'],
    years: props.years || [],
    content_type: props.content_type || 'manga',
});

export const key = (params: Params): QueryKey => ['watch-list', params];

const useReadList = ({ username, read_status, ...props }: Params) => {
    const { titleLanguage } = useSettingsContext();

    const params = paramsBuilder({
        read_status,
        username,
        ...props,
    });

    return useInfiniteList({
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getReadList({
                params,
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((b) => ({
                    ...b,
                    content: convertManga<API.Manga>({
                        manga: b.content,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export const prefetchReadList = async (props: Params) => {
    const queryClient = getQueryClient();

    const params = paramsBuilder({
        ...props,
    });

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(params),
        queryFn: ({ pageParam = 1 }) =>
            getReadList({
                params,
                page: pageParam,
            }),
    });
};

export default useReadList;
