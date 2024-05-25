import getAnimeCharacters, {
    Params,
} from '@/services/api/anime/getAnimeCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useCharacters = ({ slug }: Params) => {
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
