import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import getAnimeSchedule from '@/services/api/stats/getAnimeSchedule';
import useInfiniteList from '@/services/hooks/useInfiniteList';
import useAuth from '@/services/hooks/auth/useAuth';


const useAnimeSchedule = ({
    season,
    status,
}: {
    season?: API.Season[];
    status?: API.Status;
}) => {
    const { auth } = useAuth();

    return useInfiniteList({
        queryKey: ['animeSchedule', { season, status, auth }],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeSchedule({
                airing_season: season,
                status,
                page: pageParam,
                auth,
            }),
    });
};

export default useAnimeSchedule;
