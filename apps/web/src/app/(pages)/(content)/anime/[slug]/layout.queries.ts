import { ContentTypeEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchAnimeCharacters,
    prefetchAnimeStaff,
    prefetchFavouriteStatus,
    prefetchFranchise,
    prefetchWatchBySlug,
    prefetchWatchingUsers,
} from '@hikka/react/server';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        slug: string;
    };
    queryClient: QueryClient;
}

const prefetchQueries = async ({ params: { slug }, queryClient }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchAnimeCharacters({ slug, clientConfig, queryClient }),
        prefetchFranchise({
            slug,
            contentType: ContentTypeEnum.ANIME,
            clientConfig,
            queryClient,
        }),
        prefetchAnimeStaff({ slug, clientConfig, queryClient }),
        clientConfig.authToken
            ? prefetchWatchBySlug({ slug, clientConfig, queryClient })
            : undefined,
        clientConfig.authToken
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.ANIME,
                  clientConfig,
                  queryClient,
              })
            : undefined,
        clientConfig.authToken
            ? prefetchWatchingUsers({ slug, clientConfig, queryClient })
            : undefined,
    ]);
};

export default prefetchQueries;
