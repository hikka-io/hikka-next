import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const key = () => ['following-history'];

const useFollowingHistory = () => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: key(),
        queryFn: ({ pageParam }) =>
            getFollowingHistory({
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((h) => ({
                    ...h,
                    content:
                        h.content && 'title_ua' in h.content
                            ? convertTitle({
                                  data: h.content,
                                  titleLanguage: titleLanguage!,
                              })
                            : h.content,
                })),
            })),
        }),
    });
};

export const prefetchFollowingHistory = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchInfiniteQuery({
        initialPageParam: 1,
        queryKey: key(),
        queryFn: ({ pageParam = 1 }) =>
            getFollowingHistory({
                page: pageParam,
            }),
    });
};

export default useFollowingHistory;
