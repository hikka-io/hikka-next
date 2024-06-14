import { Params } from '@/services/api/anime/getAnimeCharacters';
import getMangaCharacters from '@/services/api/manga/getMangaCharacters';
import useInfiniteList from '@/services/hooks/use-infinite-list';

const useMangaCharacters = ({ slug }: Params) => {
    return useInfiniteList({
        queryKey: ['manga-characters', slug],
        queryFn: ({ pageParam = 1 }) =>
            getMangaCharacters({
                params: {
                    slug: String(slug),
                },
                page: pageParam,
            }),
    });
};

export default useMangaCharacters;
