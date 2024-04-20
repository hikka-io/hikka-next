import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnimeList } from '@/utils/animeAdapter';

import useAuth from '../auth/useAuth';

const useFranchise = ({ slug }: { slug: string }) => {
    const { titleLanguage } = useSettingsContext();
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['franchise', slug, { auth }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeFranchise({
                slug: String(slug),
                page: pageParam,
                auth: String(auth),
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
