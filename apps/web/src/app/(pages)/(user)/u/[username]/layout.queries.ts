import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchReadStats,
    prefetchUserFollowStats,
    prefetchUserWatchStats,
} from '@hikka/react/server';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        username: string;
    };
}

const prefetchQueries = async ({ params: { username } }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
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
        prefetchUserWatchStats({ username, clientConfig }),
        prefetchUserFollowStats({ username, clientConfig }),
    ]);
};

export default prefetchQueries;
