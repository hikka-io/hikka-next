import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import RQHydrate from '@/utils/RQHydrate';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import Actions from './layout/Actions';
import { PropsWithChildren } from 'react';
import Title from './layout/Title';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import NavBar from "./layout/NavBar";
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';

interface Props extends PropsWithChildren {
    params: { slug: string };
}

const Component = async ({ params: { slug }, children }: Props) => {
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(['anime', slug], () =>
        getAnimeInfo({ slug }),
    );
    await queryClient.prefetchQuery(['characters', slug], () =>
        getAnimeCharacters({ slug }),
    );
    await queryClient.prefetchQuery(['franchise', slug], () =>
        getAnimeFranchise({ slug }),
    );
    await queryClient.prefetchQuery(['staff', slug], () =>
        getAnimeStaff({ slug }),
    );

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <div className="grid grid-cols-1 md:grid-cols-[20%_1fr] gap-16 md:mt-24">
                <div className="flex flex-col gap-12">
                    <Actions />
                </div>
                <div className="flex flex-col gap-12">
                    <Title />
                    <NavBar />
                    {children}
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;
