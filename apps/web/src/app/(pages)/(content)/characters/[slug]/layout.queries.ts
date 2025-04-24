import { ContentTypeEnum } from '@hikka/client';
import {
    prefetchCharacterAnime,
    prefetchCharacterManga,
    prefetchCharacterNovel,
    prefetchCharacterVoices,
    prefetchFavouriteStatus,
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
        prefetchCharacterAnime({ slug, clientConfig }),
        prefetchCharacterManga({ slug, clientConfig }),
        prefetchCharacterNovel({ slug, clientConfig }),
        prefetchCharacterVoices({ slug, clientConfig }),
        prefetchFavouriteStatus({
            slug,
            contentType: ContentTypeEnum.CHARACTER,
            clientConfig,
        }),
    ]);
};

export default prefetchQueries;
