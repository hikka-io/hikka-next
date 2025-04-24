import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchFollowStats,
    prefetchReadStats,
    prefetchUserByUsername,
    prefetchWatchStats,
} from '@hikka/react';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        username: string;
    };
}

const prefetchQueries = async ({ params: { username } }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchUserByUsername({ username, clientConfig }),
        prefetchReadStats({
            username,
            contentType: ContentTypeEnum.MANGA,
            clientConfig,
        }),
        prefetchReadStats({
            username,
            contentType: ContentTypeEnum.NOVEL,
            clientConfig,
        }),
        prefetchWatchStats({ username, clientConfig }),
        prefetchFollowStats({ username, clientConfig }),
    ]);
};

export default prefetchQueries;
