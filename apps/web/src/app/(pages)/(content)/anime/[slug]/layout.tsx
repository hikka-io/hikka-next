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

import AnimeNavbar from '@/features/anime/anime-view/anime-navbar/anime-navbar.component';

import { ANIME_NAV_ROUTES } from '@/utils/constants/navigation';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';
import { cn } from '@/utils/utils';

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
        queryClient,
    });

    if (!anime) {
        console.log('Anime not found');
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug }, queryClient });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    {anime?.status && (
                        <div
                            className={cn(
                                'size-2 rounded-full bg-white',
                                `bg-${anime?.status}-foreground`,
                            )}
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

            {children}

            <AnimeNavbar className="mt-12" />
        </HydrationBoundary>
    );
};

export default AnimeLayout;
