import getFollowingHistory from '@/services/api/history/getFollowingHistory';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const useUserHistory = () => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['followingHistory'],
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
                            ? convertTitle<API.Anime>({
                                  data: h.content,
                                  titleLanguage: titleLanguage!,
                              })
                            : h.content,
                })),
            })),
        }),
    });
};

export default useUserHistory;
