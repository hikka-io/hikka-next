import { QueryClient } from '@tanstack/query-core';

import getFavourite from '@/services/api/favourite/getFavourite';
import getNovelCharacters from '@/services/api/novel/getNovelCharacters';
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
            queryKey: ['novel-characters', slug],
            queryFn: ({ pageParam = 1 }) =>
                getNovelCharacters({
                    params: { slug },
                    page: pageParam,
                }),
            initialPageParam: 1,
        }),
        auth
            ? queryClient.prefetchQuery({
                  queryKey: ['favorite', slug, { content_type: 'novel' }],
                  queryFn: ({ meta }) =>
                      getFavourite({
                          params: {
                              slug: String(slug),
                              content_type: 'novel',
                          },
                      }),
              })
            : undefined,
    ]);
};

export default prefetchQueries;
