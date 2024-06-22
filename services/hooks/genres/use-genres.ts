import { useQuery } from '@tanstack/react-query';

import { groupOptions } from '@/components/ui/select';

import getGenres from '@/services/api/genres/getGenres';
import { GENRE_TYPES } from '@/utils/constants';
import getQueryClient from '@/utils/get-query-client';

export const key = () => ['genres'];

const useGenres = () => {
    return useQuery({
        queryKey: key(),
        queryFn: () => getGenres(),
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

export const prefetchGenres = () => {
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(),
        queryFn: () => getGenres(),
    });
};

export default useGenres;
