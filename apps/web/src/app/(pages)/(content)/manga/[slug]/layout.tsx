import { ContentTypeEnum } from '@hikka/client';
import { dehydrate, getQueryClient } from '@hikka/react/core';
import {
    prefetchMangaBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import { ContentDetailLayout } from '@/features/content';

import { MANGA_NAV_ROUTES } from '@/utils/constants/navigation';
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

const MangaLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const manga = await prefetchMangaBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    if (!manga) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug }, queryClient });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.MANGA,
        },
        clientConfig,
        queryClient,
    });

    return (
        <ContentDetailLayout
            slug={slug}
            contentType={ContentTypeEnum.MANGA}
            navRoutes={MANGA_NAV_ROUTES}
            urlPrefix="/manga"
            title={manga.title_ua || manga.title_en || manga.title_original || ''}
            status={manga.status}
            dehydratedState={dehydrate(queryClient)}
        >
            {props.children}
        </ContentDetailLayout>
    );
};

export default MangaLayout;
