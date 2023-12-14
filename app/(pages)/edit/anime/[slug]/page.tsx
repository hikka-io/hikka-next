import * as React from 'react';

import { dehydrate } from '@tanstack/query-core';

import SubHeader from '@/app/_components/SubHeader';
import RQHydrate from '@/utils/RQHydrate';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import getQueryClient from '@/utils/getQueryClient';

import AnimeContent from './_layout/AnimeContent';
import AnimeEditNew from './_layout/AnimeEditNew';

interface Props {
    params: { slug: string };
}

const Component = async ({ params: { slug } }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(['anime', slug], () =>
        getAnimeInfo({ slug: String(slug) }),
    );

    const dehydratedState = dehydrate(queryClient);
    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="flex flex-col gap-8">
                    <SubHeader title={`Нова правка`} />
                    <AnimeEditNew />
                </div>
                <div className="flex flex-col gap-12">
                    <AnimeContent />
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;
