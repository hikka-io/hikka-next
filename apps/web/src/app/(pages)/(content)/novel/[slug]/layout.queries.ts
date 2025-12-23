import { ContentTypeEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchFavouriteStatus,
    prefetchFranchise,
    prefetchNovelCharacters,
    prefetchReadBySlug,
    prefetchReadingUsers,
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
        prefetchNovelCharacters({ slug, clientConfig, queryClient }),
        prefetchFranchise({
            slug,
            contentType: ContentTypeEnum.NOVEL,
            clientConfig,
        }),
        clientConfig.authToken
            ? prefetchReadBySlug({
                  slug,
                  contentType: ContentTypeEnum.NOVEL,
                  clientConfig,
                  queryClient,
              })
            : undefined,
        clientConfig.authToken
            ? prefetchReadingUsers({
                  slug,
                  contentType: ContentTypeEnum.NOVEL,
                  clientConfig,
                  queryClient,
              })
            : undefined,
        clientConfig.authToken
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.NOVEL,
                  clientConfig,
                  queryClient,
              })
            : undefined,
    ]);
};

export default prefetchQueries;
