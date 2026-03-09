import { ContentTypeEnum } from '@hikka/client';
import { dehydrate, getQueryClient } from '@hikka/react/core';
import {
    prefetchNovelBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import { ContentDetailLayout } from '@/features/content';

import { NOVEL_NAV_ROUTES } from '@/utils/constants/navigation';
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

const NovelLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const novel = await prefetchNovelBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    if (!novel) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug }, queryClient });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.NOVEL,
        },
        clientConfig,
        queryClient,
    });

    return (
        <ContentDetailLayout
            slug={slug}
            contentType={ContentTypeEnum.NOVEL}
            navRoutes={NOVEL_NAV_ROUTES}
            urlPrefix="/novel"
            title={novel.title_ua || novel.title_en || novel.title_original || ''}
            status={novel.status}
            dehydratedState={dehydrate(queryClient)}
        >
            {props.children}
        </ContentDetailLayout>
    );
};

export default NovelLayout;
