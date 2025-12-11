import { ContentTypeEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchCharacterAnime,
    prefetchCharacterManga,
    prefetchCharacterNovel,
    prefetchCharacterVoices,
    prefetchFavouriteStatus,
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
        prefetchCharacterAnime({ slug, clientConfig, queryClient }),
        prefetchCharacterManga({ slug, clientConfig, queryClient }),
        prefetchCharacterNovel({ slug, clientConfig, queryClient }),
        prefetchCharacterVoices({ slug, clientConfig, queryClient }),
        prefetchFavouriteStatus({
            slug,
            contentType: ContentTypeEnum.CHARACTER,
            clientConfig,
            queryClient,
        }),
    ]);
};

export default prefetchQueries;
