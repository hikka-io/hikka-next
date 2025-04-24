import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchFavouriteStatus,
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
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.MANGA,
                  clientConfig,
              })
            : undefined,
    ]);
};

export default prefetchQueries;
