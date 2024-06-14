import { QueryClient } from '@tanstack/query-core';

import getFavourite from '@/services/api/favourite/getFavourite';
import getMangaCharacters from '@/services/api/manga/getMangaCharacters';
import { getCookie } from '@/utils/cookies';

interface Props {
    queryClient: QueryClient;
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ queryClient, params: { slug } }: Props) => {
    const auth = await getCookie('auth');

    await Promise.all([
        queryClient.prefetchInfiniteQuery({
            queryKey: ['manga-characters', slug],
            queryFn: ({ pageParam = 1 }) =>
                getMangaCharacters({
                    params: { slug },
                    page: pageParam,
                }),
            initialPageParam: 1,
        }),
        auth
            ? queryClient.prefetchQuery({
                  queryKey: ['favorite', slug, { content_type: 'manga' }],
                  queryFn: ({ meta }) =>
                      getFavourite({
                          params: {
                              slug: String(slug),
                              content_type: 'manga',
                          },
                      }),
              })
            : undefined,
    ]);
};

export default prefetchQueries;
