import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchFavouriteStatus,
    prefetchFollowingReaders,
    prefetchFranchise,
    prefetchMangaCharacters,
} from '@hikka/react';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchMangaCharacters({ slug, clientConfig }),
        prefetchFranchise({
            slug,
            contentType: ContentTypeEnum.MANGA,
            clientConfig,
        }),
        clientConfig.authToken
            ? prefetchFollowingReaders({
                  slug,
                  contentType: ContentTypeEnum.MANGA,
                  clientConfig,
              })
            : undefined,
        clientConfig.authToken
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.MANGA,
                  clientConfig,
              })
            : undefined,
    ]);
};

export default prefetchQueries;
