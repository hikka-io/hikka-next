import { useQuery } from '@tanstack/react-query';

import getAnimeCatalog from '@/services/api/anime/getAnimeCatalog';

interface Props {
    value?: string;
}

const useAnimeSearchList = ({ value }: Props) => {
    return useQuery<API.WithPagination<API.Anime>, Error>({
        queryKey: ['animeSearchList', value],
        queryFn: () =>
            getAnimeCatalog({
                query: value,
            }),
        enabled: value !== undefined && value.length >= 3,
    });
};

export default useAnimeSearchList;
