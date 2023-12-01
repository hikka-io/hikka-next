import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import RQHydrate from '@/utils/RQHydrate';
import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/utils/api/anime/getAnimeInfo';
import Actions from '@/app/anime/[slug]/_layout/Actions';
import React, { PropsWithChildren } from 'react';
import Title from '@/app/anime/[slug]/_layout/Title';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import WatchListStats from '@/app/anime/[slug]/_layout/WatchListStats';
import Cover from '@/app/anime/[slug]/_layout/Cover';
import { Metadata, ResolvingMetadata } from 'next';
import NavBar from './_layout/NavBar';
import NavMenu from '@/app/anime/[slug]/_layout/NavMenu';
import Link from 'next/link';
import Breadcrumbs from '@/app/_components/Breadcrumbs';
import { RELEASE_STATUS } from '@/utils/constants';
import SubBar from '@/app/_components/SubBar';
import About from '@/app/anime/[slug]/_layout/About';
import {getCookie} from "@/app/actions";

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
            title: { default: title, template: title + ' / %s / Hikka' },
            description: synopsis,
            images: anime.poster,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: synopsis,
            images: anime.poster,
        },
    };
}

const Component = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery(['anime', slug], () =>
        getAnimeInfo({ slug }),
    );
    await queryClient.prefetchInfiniteQuery(['characters', slug], () =>
        getAnimeCharacters({ slug }),
    );

    await queryClient.prefetchInfiniteQuery(['franchise', slug, secret], () =>
        getAnimeFranchise({ slug, secret }),
    );
    await queryClient.prefetchInfiniteQuery(['staff', slug], () =>
        getAnimeStaff({ slug }),
    );

    const anime: Hikka.Anime | undefined = queryClient.getQueryData([
        'anime',
        slug,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex gap-4 items-center overflow-hidden whitespace-nowrap w-auto">
                        <div
                            className="w-2 h-2 bg-white rounded-full"
                            style={{
                                backgroundColor:
                                    RELEASE_STATUS[
                                        anime?.status as Hikka.Status
                                    ].color,
                            }}
                        />
                        <Link
                            href={'/anime/' + anime?.slug}
                            className="text-sm font-bold flex-1 overflow-hidden overflow-ellipsis hover:underline"
                        >
                            {anime?.title_ua ||
                                anime?.title_en ||
                                anime?.title_ja}
                        </Link>
                    </div>
                    <NavMenu />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <NavBar />
                </SubBar>
                <div className="grid grid-cols-1 lg:grid-cols-[20%_1fr] lg:gap-16 gap-12">
                    <div className="flex flex-col gap-4">
                        <Cover />
                        <div className="flex flex-col gap-12 lg:sticky lg:top-20 lg:self-start w-full">
                            <Actions />
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
