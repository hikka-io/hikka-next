import { useSearchParams } from 'next/navigation';

import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import useInfiniteList from '@/services/hooks/use-infinite-list';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getCurrentSeason from '@/utils/get-current-season';
import { convertTitle } from '@/utils/title-adapter';

const useAnimeSchedule = () => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams();

    const only_watch = searchParams.get('only_watch')
        ? Boolean(searchParams.get('only_watch'))
        : undefined;
    const season =
        (searchParams.get('season') as API.Season) || getCurrentSeason()!;
    const year = searchParams.get('year') || String(new Date().getFullYear());
    const status = (
        searchParams.getAll('status').length > 0
            ? searchParams.getAll('status')
            : ['ongoing', 'announced']
    ) as API.Status[];

    return useInfiniteList({
        queryKey: ['animeSchedule', { season, status, year, only_watch }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                params: {
                    airing_season: [season, year],
                    status,
                    only_watch: only_watch,
                },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((s) => ({
                    ...s,
                    anime: convertTitle<API.AnimeInfo>({
                        data: s.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export default useAnimeSchedule;
