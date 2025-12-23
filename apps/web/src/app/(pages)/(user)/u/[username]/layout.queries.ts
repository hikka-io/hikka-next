import { ContentTypeEnum } from '@hikka/client';
import { QueryClient } from '@hikka/react/core';
import {
    prefetchReadStats,
    prefetchUserFollowStats,
    prefetchUserWatchStats,
} from '@hikka/react/server';

import { getHikkaClientConfig } from '@/utils/hikka-client';

interface Props {
    params: {
        username: string;
    };
    queryClient: QueryClient;
}

const prefetchQueries = async ({
    params: { username },
    queryClient,
}: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchReadStats({
            username,
            contentType: ContentTypeEnum.MANGA,
            clientConfig,
            queryClient,
        }),
        prefetchReadStats({
            username,
            contentType: ContentTypeEnum.NOVEL,
            clientConfig,
            queryClient,
        }),
        prefetchUserWatchStats({ username, clientConfig, queryClient }),
        prefetchUserFollowStats({ username, clientConfig, queryClient }),
    ]);
};

export default prefetchQueries;
