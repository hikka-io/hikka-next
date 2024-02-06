import useInfiniteList from '@/app/_utils/hooks/useInfiniteList';
import getCharacterAnime from '@/app/_utils/api/characters/getCharacterAnime';

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