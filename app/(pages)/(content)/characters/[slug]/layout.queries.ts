import { QueryClient } from '@tanstack/query-core';

import getCharacterAnime from '@/services/api/characters/getCharacterAnime';
import getCharacterVoices from '@/services/api/characters/getCharacterVoices';
import getFavourite from '@/services/api/favourite/getFavourite';

interface Props {
    queryClient: QueryClient;
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ queryClient, params: { slug } }: Props) => {
    await Promise.all([
        await queryClient.prefetchInfiniteQuery({
            queryKey: ['characterAnime', slug],
            queryFn: ({ meta }) =>
                getCharacterAnime({
                    params: {
                        slug,
                    },
                    auth: meta?.auth,
                }),
            initialPageParam: 1,
        }),

        await queryClient.prefetchInfiniteQuery({
            queryKey: ['characterVoices', slug],
            queryFn: ({ meta }) =>
                getCharacterVoices({
                    params: {
                        slug,
                    },
                    auth: meta?.auth,
                }),
            initialPageParam: 1,
        }),

        await queryClient.prefetchQuery({
            queryKey: ['favorite', slug, { content_type: 'character' }],
            queryFn: ({ meta }) =>
                getFavourite({
                    params: {
                        slug: String(slug),
                        content_type: 'character',
                    },
                    auth: meta?.auth,
                }),
        }),
    ]);
};

export default prefetchQueries;
