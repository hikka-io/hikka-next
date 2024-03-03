import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import Breadcrumbs from '@/components/breadcrumbs';
import InternalNavBar from '@/components/internal-navbar';
import NavMenu from '@/components/nav-menu';
import SubBar from '@/components/sub-navbar';
import { Button } from '@/components/ui/button';
import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/services/api/anime/getAnimeInfo';
import getAnimeStaff from '@/services/api/anime/getAnimeStaff';
import getFavourite from '@/services/api/favourite/getFavourite';
import getWatch from '@/services/api/watch/getWatch';
import { ANIME_NAV_ROUTES, RELEASE_STATUS } from '@/utils/constants';
import getDeclensionWord from '@/utils/getDeclensionWord';
import getQueryClient from '@/utils/getQueryClient';

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

    const anime = await queryClient.fetchQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['characters', slug],
        queryFn: ({ pageParam }) =>
            getAnimeCharacters({ slug, page: pageParam }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['franchise', slug, { secret }],
        queryFn: ({ pageParam }) =>
            getAnimeFranchise({ slug, secret, page: pageParam }),
        initialPageParam: 1,
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['staff', slug],
        queryFn: ({ pageParam }) => getAnimeStaff({ slug, page: pageParam }),
        initialPageParam: 1,
    });

    await queryClient.prefetchQuery({
        queryKey: ['watch', slug, { secret }],
        queryFn: () => getWatch({ slug: slug, secret: String(secret) }),
    });

    await queryClient.prefetchQuery({
        queryKey: ['favorite', slug, { secret }],
        queryFn: () =>
            getFavourite({ slug: String(slug), secret: String(secret) }),
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <div
                            className="h-2 w-2 rounded-full bg-white"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[anime?.status as API.Status]
                                        .color,
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
                        <Cover anime={anime} />
                        <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                            <Actions anime={anime} />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    asChild
                                >
                                    <Link href={`/anime/${slug}/comments`}>
                                        <IconamoonCommentFill />
                                        {anime?.comments_count || 0}{' '}
                                        {getDeclensionWord(
                                            anime?.comments_count || 0,
                                            [
                                                'коментар',
                                                'коментарі',
                                                'коментарів',
                                            ],
                                        )}
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
        </HydrationBoundary>
    );
};

export default Component;
