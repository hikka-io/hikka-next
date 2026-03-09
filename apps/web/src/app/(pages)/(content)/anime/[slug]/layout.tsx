import { ContentTypeEnum } from '@hikka/client';
import { dehydrate, getQueryClient } from '@hikka/react/core';
import {
    prefetchAnimeBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import { ContentDetailLayout } from '@/features/content';

import { ANIME_NAV_ROUTES } from '@/utils/constants/navigation';
import { getHikkaClientConfig } from '@/utils/hikka-client';

import _generateMetadata, { MetadataProps } from './layout.metadata';
import prefetchQueries from './layout.queries';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
): Promise<Metadata> {
    const params = await props.params;
    const searchParams = await props.searchParams;

    return await _generateMetadata({ params, searchParams });
}

const AnimeLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const anime = await prefetchAnimeBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    if (!anime) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug }, queryClient });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.ANIME,
        },
        clientConfig,
        queryClient,
    });

    return (
        <ContentDetailLayout
            slug={slug}
            contentType={ContentTypeEnum.ANIME}
            navRoutes={ANIME_NAV_ROUTES}
            urlPrefix="/anime"
            title={anime.title_ua || anime.title_en || anime.title_ja || ''}
            status={anime.status}
            dehydratedState={dehydrate(queryClient)}
        >
            {props.children}
        </ContentDetailLayout>
    );
};

export default AnimeLayout;
