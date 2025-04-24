import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchFavouriteStatus,
    prefetchFranchise,
    prefetchNovelCharacters,
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
        prefetchNovelCharacters({ slug, clientConfig }),
        prefetchFranchise({
            slug,
            contentType: ContentTypeEnum.NOVEL,
            clientConfig,
        }),
        clientConfig.authToken
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.NOVEL,
                  clientConfig,
              })
            : undefined,
    ]);
};

export default prefetchQueries;
