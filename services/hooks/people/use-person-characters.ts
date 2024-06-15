import getPersonCharacters, {
    Params,
} from '@/services/api/people/getPersonCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const usePersonCharacters = (
    { slug }: Params,
    options?: Hikka.QueryOptions,
) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['personCharacters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getPersonCharacters({
                params: { slug },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((ch) => ({
                    ...ch,
                    anime: convertTitle<API.AnimeInfo>({
                        data: ch.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export default usePersonCharacters;
