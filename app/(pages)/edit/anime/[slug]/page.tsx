import * as React from 'react';

import { dehydrate } from '@tanstack/query-core';

import SubHeader from '@/app/_components/sub-header';
import RQHydrate from '@/app/_utils/RQ-hydrate';
import getAnimeInfo from '@/app/_utils/api/anime/getAnimeInfo';
import getQueryClient from '@/app/_utils/getQueryClient';

import AnimeContent from './_components/anime-content';
import AnimeEditNew from './_components/edit-new/edit-new';
import RulesAlert from './_components/rules-alert';

interface Props {
    params: {
        slug: string;
    };
}

const Component = async ({ params: { slug } }: Props) => {
    const queryClient = getQueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['anime', slug],
        queryFn: () => getAnimeInfo({ slug: String(slug) }),
    });

    const dehydratedState = dehydrate(queryClient);
    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <div className="flex flex-col gap-8">
                    <SubHeader title={`Нова правка`} />
                    <RulesAlert />
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