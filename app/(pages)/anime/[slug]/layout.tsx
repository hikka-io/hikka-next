import { Metadata } from 'next';
import React, { PropsWithChildren } from 'react';
import IconamoonCommentFill from '~icons/iconamoon/comment-fill';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import Actions from '@/app/(pages)/anime/[slug]/components/actions';
import Cover from '@/app/(pages)/anime/[slug]/components/cover';
import Title from '@/app/(pages)/anime/[slug]/components/title';
import Breadcrumbs from '@/components/navbar/nav-breadcrumbs';
import NavMenu from '@/components/navbar/nav-dropdown';
import InternalNavBar from '@/components/navbar/nav-tabs';
import SubBar from '@/components/navbar/sub-nav';
import { Button } from '@/components/ui/button';
import getAnimeCharacters from '@/services/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/services/api/anime/getAnimeFranchise';
import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/services/api/anime/getAnimeInfo';
import getAnimeStaff from '@/services/api/anime/getAnimeStaff';
import getFavourite from '@/services/api/favourite/getFavourite';
import getFollowingWatchList from '@/services/api/watch/getFollowingWatchList';
import getWatch from '@/services/api/watch/getWatch';
import { getCookie } from '@/utils/actions';
import { ANIME_NAV_ROUTES, RELEASE_STATUS } from '@/utils/constants';
import _generateMetadata from '@/utils/generateMetadata';
import getDeclensionWord from '@/utils/getDeclensionWord';
import getQueryClient from '@/utils/getQueryClient';
import parseTextFromMarkDown from '@/utils/parseTextFromMarkDown';
import truncateText from '@/utils/truncateText';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

// export const runtime = 'edge';
export const revalidate = 60;

export async function generateMetadata({
    params,
}: {
    params: {
        slug: string;
    };
}): Promise<Metadata> {
    const slug = params.slug;

    const anime: AnimeResponse = await getAnimeInfo({ slug });

    const startDate = anime.start_date
        ? new Date(anime.start_date * 1000).getFullYear()
        : null;
    const title =
        (anime.title_ua || anime.title_en || anime.title_ja) +
        (startDate ? ` (${startDate})` : '');
    let synopsis: string | null = truncateText(
        parseTextFromMarkDown(anime.synopsis_ua || anime.synopsis_en),
        150,
        true,
    );

    return _generateMetadata({
        title: {
            default: title,
            template: title + ' / %s / Hikka',
        },
        description: synopsis,
        images: `https://hikka.io/generate/preview/anime/${slug}/${anime.updated}`,
    });
}

const AnimeLayout = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    const auth = await getCookie('auth');

    await queryClient.prefetchQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug }),
    });

    const anime: API.AnimeInfo | undefined = queryClient.getQueryData([
        'anime',
        slug,
    ]);

    if (!anime) {
        return redirect('/');
    }

    await Promise.all([
        queryClient.prefetchInfiniteQuery({
            queryKey: ['characters', slug],
            queryFn: ({ pageParam = 1 }) =>
                getAnimeCharacters({ slug, page: pageParam }),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['franchise', slug, { auth }],
            queryFn: ({ pageParam = 1 }) =>
                getAnimeFranchise({ slug, auth, page: pageParam }),
            initialPageParam: 1,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['staff', slug],
            queryFn: ({ pageParam = 1 }) =>
                getAnimeStaff({ slug, page: pageParam }),
            initialPageParam: 1,
        }),
        auth
            ? queryClient.prefetchQuery({
                  queryKey: ['watch', slug, { auth }],
                  queryFn: () => getWatch({ slug: slug, auth: String(auth) }),
              })
            : undefined,
        auth
            ? queryClient.prefetchQuery({
                  queryKey: ['favorite', slug, { auth, content_type: 'anime' }],
                  queryFn: () =>
                      getFavourite({
                          slug: String(slug),
                          auth: String(auth),
                          content_type: 'anime',
                      }),
              })
            : undefined,
        auth
            ? queryClient.prefetchInfiniteQuery({
                  initialPageParam: 1,
                  queryKey: ['followingWatchList', slug, { auth }],
                  queryFn: ({ pageParam = 1 }) =>
                      getFollowingWatchList({
                          slug: slug,
                          auth: String(auth),
                          page: pageParam,
                      }),
              })
            : undefined,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <div
                            className="size-2 rounded-full bg-white"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[anime?.status as API.Status]
                                        .color,
                            }}
                        />
                        <Link
                            href={'/anime/' + anime?.slug}
                            className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
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

export default AnimeLayout;
