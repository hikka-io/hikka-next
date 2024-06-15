import getUserHistory, { Params } from '@/services/api/history/getUserHistory';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const useUserHistory = ({ username }: Params) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['history', username],
        queryFn: ({ pageParam }) =>
            getUserHistory({
                page: pageParam,
                params: { username },
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
