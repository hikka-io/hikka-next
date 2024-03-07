import getCharacterAnime from '@/services/api/characters/getCharacterAnime';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useCharacterAnime = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['characterAnime', slug],
        queryFn: ({ pageParam = 1 }) =>
            getCharacterAnime({
                slug: slug,
                page: pageParam,
            }),
    });
};

export default useCharacterAnime;
