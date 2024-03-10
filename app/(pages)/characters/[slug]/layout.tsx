import { Metadata, ResolvingMetadata } from 'next';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';

import { getCookie } from '@/app/actions';
import Breadcrumbs from '@/components/breadcrumbs';
import InternalNavBar from '@/components/internal-navbar';
import NavMenu from '@/components/nav-menu';
import SubBar from '@/components/sub-navbar';
import getCharacterAnime from '@/services/api/characters/getCharacterAnime';
import getCharacterInfo, {
    Response as CharacterResponse,
} from '@/services/api/characters/getCharacterInfo';
import getFavourite from '@/services/api/favourite/getFavourite';
import { CHARACTER_NAV_ROUTES } from '@/utils/constants';
import getQueryClient from '@/utils/getQueryClient';

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

    const character: CharacterResponse = await getCharacterInfo({ slug });
    const title = character.name_ua || character.name_en || character.name_ja;

    return {
        title: { default: title, template: title + ' / %s / Hikka' },
        description: undefined,
        openGraph: {
            siteName: parentMetadata.openGraph?.siteName,
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
        twitter: {
            title: { default: title, template: title + ' / %s / Hikka' },
            description: undefined,
            images: character.image,
        },
    };
}

const Component = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    const secret = await getCookie('secret');

    await queryClient.prefetchQuery({
        queryKey: ['character', slug],
        queryFn: () => getCharacterInfo({ slug }),
    });

    await queryClient.prefetchInfiniteQuery({
        queryKey: ['characterAnime', slug],
        queryFn: () => getCharacterAnime({ slug }),
        initialPageParam: 1,
    });

    await queryClient.prefetchQuery({
        queryKey: ['favorite', slug, { secret, content_type: 'character' }],
        queryFn: () =>
            getFavourite({
                slug: String(slug),
                secret: String(secret),
                content_type: 'character',
            }),
    });

    const character: API.Character | undefined = queryClient.getQueryData([
        'character',
        slug,
    ]);

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <>
                <Breadcrumbs>
                    <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                        <Link
                            href={'/characters/' + character?.slug}
                            className="flex-1 overflow-hidden overflow-ellipsis text-sm font-bold hover:underline"
                        >
                            {character?.name_ua ||
                                character?.name_en ||
                                character?.name_ja}
                        </Link>
                    </div>
                    <NavMenu
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={'/characters/' + slug}
                    />
                </Breadcrumbs>
                <SubBar mobileOnly>
                    <InternalNavBar
                        routes={CHARACTER_NAV_ROUTES}
                        urlPrefix={'/characters/' + slug}
                    />
                </SubBar>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                    <div className="flex flex-col gap-4">
                        <Cover />
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
