import getAnimeFranchise, {
    Params,
} from '@/services/api/anime/getAnimeFranchise';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/anime-adapter';

const useFranchise = ({ slug }: Params) => {
    const { titleLanguage } = useSettingsContext();

    return useInfiniteList({
        queryKey: ['franchise', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                params: { slug },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: convertAnimeList<API.Anime>({
                    anime: a.list,
                    titleLanguage: titleLanguage!,
                }),
            })),
        }),
    });
};

export default useFranchise;
