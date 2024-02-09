import useInfiniteList from '@/services/hooks/useInfiniteList';
import getCharacterAnime from '@/services/api/characters/getCharacterAnime';

export const useCharacterAnime = (slug: string) => {
    return useInfiniteList({
        queryKey: ['characterAnime', slug],
        queryFn: ({ pageParam = 1 }) =>
            getCharacterAnime({
                slug: slug,
                page: pageParam,
            }),
    })
}