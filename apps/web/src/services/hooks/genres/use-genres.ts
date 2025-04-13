import { useQuery } from '@tanstack/react-query';

import { groupOptions } from '@/components/ui/select';
import { GENRE_TYPES } from '@/utils/constants/common';
import getQueryClient from '@/utils/get-query-client';
import getGenres from '../../api/genres/getGenres';

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
