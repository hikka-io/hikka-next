import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchAnimeBySlug } from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';

import Actions from '@/features/anime/anime-view/actions/actions.component';
import Cover from '@/features/anime/anime-view/cover.component';
import Title from '@/features/anime/anime-view/title.component';

import { RELEASE_STATUS } from '@/utils/constants/common';
import { ANIME_NAV_ROUTES } from '@/utils/constants/navigation';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

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
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const anime = await prefetchAnimeBySlug({
        slug,
        clientConfig,
    });

    if (!anime) {
        console.log('Anime not found');
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug } });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    {anime?.status && (
                        <div
                            className="size-2 rounded-full bg-white"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[anime?.status].color,
                            }}
                        />
                    )}
                    <Link
                        href={'/anime/' + anime?.slug}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {anime?.title_ua || anime?.title_en || anime?.title_ja}
                    </Link>
                </div>
                <NavMenu
                    routes={ANIME_NAV_ROUTES}
                    urlPrefix={`/anime/${slug}`}
                />
            </Breadcrumbs>
            <SubBar>
                <InternalNavBar
                    routes={ANIME_NAV_ROUTES}
                    urlPrefix={`/anime/${slug}`}
                />
            </SubBar>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                <div className="flex flex-col gap-4">
                    <Cover />
                    <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                        <Actions />
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <Title />
                    {children}
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default AnimeLayout;
