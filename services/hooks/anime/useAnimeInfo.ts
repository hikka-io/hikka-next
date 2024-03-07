import { useQuery } from '@tanstack/react-query';

import getAnimeInfo from '@/services/api/anime/getAnimeInfo';

const useAnimeInfo = ({
    slug,
    enabled,
}: {
    slug: string;
    enabled?: boolean;
}) => {
    return useQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
        enabled: enabled,
    });
};

export default useAnimeInfo;
