import { ContentTypeEnum } from '@hikka/client';
import { getQueryClient } from '@hikka/react/core';
import { prefetchAnimeBySlug } from '@hikka/react/server';
import { FC } from 'react';

import { MovieBanner } from '@/features/anime';
import { ContentDetailPage, ContentMedia as Media } from '@/features/content';

import { getHikkaClientConfig } from '@/utils/hikka-client';

import jsonSchema from './anime.schema';

interface Props {
    params: {
        slug: string;
    };
}

const AnimePage: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const anime = await prefetchAnimeBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    return (
        <ContentDetailPage
            contentType={ContentTypeEnum.ANIME}
            slug={slug}
            afterDescription={<MovieBanner />}
            afterFranchise={<Media />}
            jsonLd={
                anime ? (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(jsonSchema({ anime })),
                        }}
                    />
                ) : undefined
            }
        />
    );
};

export default AnimePage;
