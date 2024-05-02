import { useSearchParams } from 'next/navigation';

import getWatchList from '@/services/api/watch/getWatchList';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertAnime } from '@/utils/animeAdapter';

const useWatchList = ({
    username,
    watch_status,
}: {
    username: string;
    watch_status: API.WatchStatus;
}) => {
    const { titleLanguage } = useSettingsContext();
    const searchParams = useSearchParams();

    const types = searchParams.getAll('types');
    const statuses = searchParams.getAll('statuses');
    const seasons = searchParams.getAll('seasons');
    const ageRatings = searchParams.getAll('ratings');
    const years = searchParams.getAll('years');
    const genres = searchParams.getAll('genres');

    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'watch_score';

    return useInfiniteList({
        queryKey: [
            'watchList',
            username,
            {
                watch_status,
                types,
                statuses,
                seasons,
                ageRatings,
                genres,
                order,
                sort,
                years,
            },
        ],
        queryFn: ({ pageParam = 1 }) =>
            getWatchList({
                params: {
                    username: username,
                    watch_status: watch_status,
                    media_type: types,
                    season: seasons,
                    rating: ageRatings,
                    status: statuses,
                    sort: [`${sort}:${order}`],
                    genres,
                    years: years && years.length == 2 ? years : undefined,
                },
                page: pageParam,
            }),
        select: (data) => ({
            ...data,
            pages: data.pages.map((a) => ({
                ...a,
                list: a.list.map((b) => ({
                    ...b,
                    anime: convertAnime<API.Anime>({
                        anime: b.anime,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
    });
};

export default useWatchList;
