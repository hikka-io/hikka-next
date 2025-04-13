import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';
import getFollowingHistory from '../../api/history/getFollowingHistory';
import { useSettingsContext } from '../../providers/settings-provider';
import useInfiniteList from '../use-infinite-list';

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
