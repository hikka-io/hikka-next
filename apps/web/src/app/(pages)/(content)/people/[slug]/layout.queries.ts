import {
    prefetchPersonAnime,
    prefetchPersonCharacters,
    prefetchPersonManga,
    prefetchPersonNovel,
} from '@hikka/react/server';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props {
    params: {
        slug: string;
    };
}

const prefetchQueries = async ({ params: { slug } }: Props) => {
    const clientConfig = await getHikkaClientConfig();

    await Promise.all([
        prefetchPersonAnime({ slug, clientConfig }),
        prefetchPersonManga({ slug, clientConfig }),
        prefetchPersonNovel({ slug, clientConfig }),
        prefetchPersonCharacters({ slug, clientConfig }),
    ]);
};

export default prefetchQueries;
