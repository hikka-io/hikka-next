import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';

import Breadcrumbs from '@/app/_components/breadcrumbs';
import InternalNavBar from '@/app/_components/internal-navbar';
import NavMenu from '@/app/_components/nav-menu';
import SubBar from '@/app/_components/sub-navbar';
import { Button } from '@/app/_components/ui/button';
import RQHydrate from '@/app/_utils/RQ-hydrate';
import getAnimeCharacters from '@/app/_utils/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/app/_utils/api/anime/getAnimeFranchise';
import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/app/_utils/api/anime/getAnimeInfo';
import getAnimeStaff from '@/app/_utils/api/anime/getAnimeStaff';
import { ANIME_NAV_ROUTES, RELEASE_STATUS } from '@/app/_utils/constants';
import getQueryClient from '@/app/_utils/getQueryClient';
import { getCookie } from '@/app/actions';

import Actions from './_components/actions';
import Cover from './_components/cover';
import Title from './_components/title';


interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

// export const runtime = 'edge';

export async function generateMetadata(
    {
        params,
    }: {
        params: {
            slug: string;
        };
    },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const parentMetadata = await parent;
    const slug = params.slug;

    const anime: AnimeResponse = await getAnimeInfo({ slug });
    const startDate = anime.start_date
        ? new Date(anime.start_date * 1000).getFullYear()
        : null;
    const title =
        (anime.title_ua || anime.title_en || anime.title_ja) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | undefined = anime.synopsis_ua || anime.synopsis_en;

    synopsis =
        synopsis &&
        (synopsis.length > 150
            ? synopsis.substring(
                  0,
                  150 + synopsis.substring(150).indexOf(' '),
              ) + '...'
            : synopsis.length > 0
              ? synopsis + '...'
              : undefined);

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: synopsis,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: synopsis,
            images: 'https://hikka.io/generate/preview/anime/' + slug,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: synopsis,
            images: 'https://hikka.io/generate/preview/anime/' + slug,
        },
    };
}

/*const filteredRoutes = ANIME_NAV_ROUTES.filter((r) => {
    switch (r.slug) {
        case 'characters':
            return (
                characters !== undefined &&
                characters.pages.length > 0 &&
                characters.pages[0].list.length > 0
            );
        case 'staff':
            return (
                staff !== undefined &&
                staff.pages.length > 0 &&
                staff.pages[0].list.length > 0
            );
        case 'media':
            return (
                anime &&
                (anime?.ost || anime?.videos) &&
                (anime?.ost.length > 0 || anime?.videos.length > 0)
            );
        case 'links':
            return anime && anime?.external && anime.external.length > 0;
        case 'franchise':
            return anime && anime.has_franchise;
        case 'general':
            return true;
        case 'comments':
            return true;
    }
});*/

const Component = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['characters', slug],
        queryFn: () => getAnimeCharacters({ slug }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['franchise', slug, secret],
        queryFn: () => getAnimeFranchise({ slug, secret }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['staff', slug],
        queryFn: () => getAnimeStaff({ slug }),
        initialPageParam: 1,
    });

    const anime: Hikka.Anime | undefined = queryClient.getQueryData([
        'anime',
        slug,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <div
                            className="h-2 w-2 rounded-full bg-white"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[
                                        anime?.status as Hikka.Status
                                    ].color,
                            }}
                        />
                        <Link
                            href={'/anime/' + anime?.slug}
                            className="flex-1 overflow-hidden overflow-ellipsis text-sm font-bold hover:underline"
                        >
                            {anime?.title_ua ||
                                anime?.title_en ||
                                anime?.title_ja}
                        </Link>
                    </div>
                    <NavMenu
                        routes={ANIME_NAV_ROUTES}
                        urlPrefix={'/anime/' + slug}
                    />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <InternalNavBar
                        routes={ANIME_NAV_ROUTES}
                        urlPrefix={'/anime/' + slug}
                    />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
                        <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                            <Actions />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    asChild
                                >
                                    <Link href={`/anime/${slug}/comments`}>
                                        <IconamoonCommentFill />
                                        Обговорення
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-12">
                        <Title />
                        {children}
                    </div>
                </div>
            </>
        </RQHydrate>
    );
};

export default Component;