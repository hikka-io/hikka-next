import { ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchAnimeBySlug } from '@hikka/react/server';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import ContentHeader from '@/components/content-header';

import getHikkaClientConfig from '@/utils/get-hikka-client-config';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

const AnimeLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const anime = await prefetchAnimeBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    if (!anime) {
        console.log('Anime not found');
        return permanentRedirect('/');
    }

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="container flex max-w-3xl flex-col gap-12 p-0">
                <div className="flex flex-col gap-16">
                    <ContentHeader
                        disableBreadcrumbs
                        slug={params.slug}
                        content_type={ContentTypeEnum.ANIME}
                    />
                    {children}
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default AnimeLayout;
