import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchAnimeCharacters,
    prefetchAnimeStaff,
    prefetchFavouriteStatus,
    prefetchFollowingWatchers,
    prefetchFranchise,
    prefetchWatchEntry,
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
        prefetchAnimeCharacters({ slug, clientConfig }),
        prefetchFranchise({
            slug,
            contentType: ContentTypeEnum.ANIME,
            clientConfig,
        }),
        prefetchAnimeStaff({ slug, clientConfig }),
        clientConfig.authToken
            ? prefetchWatchEntry({ slug, clientConfig })
            : undefined,
        clientConfig.authToken
            ? prefetchFavouriteStatus({
                  slug,
                  contentType: ContentTypeEnum.ANIME,
                  clientConfig,
              })
            : undefined,
        clientConfig.authToken
            ? prefetchFollowingWatchers({ slug, clientConfig })
            : undefined,
    ]);
};

export default prefetchQueries;
