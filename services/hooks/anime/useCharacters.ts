import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import useInfiniteList from '@/services/hooks/useInfiniteList';

const useCharacters = ({ slug }: { slug: string }) => {
    return useInfiniteList({
        queryKey: ['characters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getAnimeCharacters({
                params: {
                    slug: String(slug),
                },
                page: pageParam,
            }),
    });
};

export default useCharacters;
