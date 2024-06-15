import { Params } from '@/services/api/anime/getAnimeCharacters';
import getNovelCharacters from '@/services/api/novel/getNovelCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useNovelCharacters = ({ slug }: Params) => {
    return useInfiniteList({
        queryKey: ['novel-characters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getNovelCharacters({
                params: {
                    slug: String(slug),
                },
                page: pageParam,
            }),
    });
};

export default useNovelCharacters;
