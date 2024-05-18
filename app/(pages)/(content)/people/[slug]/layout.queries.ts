import { QueryClient } from '@tanstack/query-core';

import getPersonAnime from '@/services/api/people/getPersonAnime';
import getPersonCharacters from '@/services/api/people/getPersonCharacters';

interface Props {
    queryClient: QueryClient;
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ queryClient, params: { slug } }: Props) => {
    await Promise.all([
        await queryClient.prefetchInfiniteQuery({
            queryKey: ['personAnime', slug],
            queryFn: ({ meta }) =>
                getPersonAnime({
                    params: {
                        slug,
                    },
                }),
            initialPageParam: 1,
        }),

        await queryClient.prefetchInfiniteQuery({
            queryKey: ['personCharacters', slug],
            queryFn: ({ meta }) =>
                getPersonCharacters({
                    params: {
                        slug,
                    },
                }),
            initialPageParam: 1,
        }),
    ]);
};

export default prefetchQueries;
