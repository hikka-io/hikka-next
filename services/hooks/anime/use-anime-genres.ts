import { useQuery } from '@tanstack/react-query';

import { groupOptions } from '@/components/ui/select';

import getAnimeGenres from '@/services/api/anime/getAnimeGenres';
import { GENRE_TYPES } from '@/utils/constants';

const useAnimeGenres = () => {
    return useQuery({
        queryKey: ['animeGenres'],
        queryFn: () => getAnimeGenres(),
        select: (data) =>
            groupOptions(
                data.list.map((genre) => ({
                    value: genre.slug,
                    label: genre.name_ua,
                    group: GENRE_TYPES[genre.type].title_ua,
                })),
            ),
    });
};

export default useAnimeGenres;
