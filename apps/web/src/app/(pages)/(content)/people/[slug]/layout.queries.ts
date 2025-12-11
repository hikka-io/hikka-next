import { QueryClient } from '@hikka/react/core';
import {
    prefetchPersonAnime,
    prefetchPersonCharacters,
    prefetchPersonManga,
    prefetchPersonNovel,
} from '@hikka/react/server';

import { getHikkaClientConfig } from '@/utils/hikka-client';

interface Props {
    params: {
        slug: string;
    };
    queryClient: QueryClient;
}

const prefetchQueries = async ({ params: { slug }, queryClient }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchPersonAnime({ slug, clientConfig, queryClient }),
        prefetchPersonManga({ slug, clientConfig, queryClient }),
        prefetchPersonNovel({ slug, clientConfig, queryClient }),
        prefetchPersonCharacters({ slug, clientConfig, queryClient }),
    ]);
};

export default prefetchQueries;
