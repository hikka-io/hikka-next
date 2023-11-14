import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import RQHydrate from '@/utils/RQHydrate';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import Actions from '@/app/anime/[slug]/_layout/Actions';
import { PropsWithChildren } from 'react';
import Title from '@/app/anime/[slug]/_layout/Title';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import NavBar from '@/app/anime/[slug]/_layout/NavBar';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import WatchListStats from '@/app/anime/[slug]/_layout/WatchListStats';
import Cover from "@/app/anime/[slug]/_layout/Cover";

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
            <div className="grid grid-cols-1 md:grid-cols-[25%_1fr] md:gap-16 gap-12">
                <div className="flex flex-col gap-4">
                    <Cover />
                    <div className="flex flex-col gap-12 md:sticky md:top-24 md:self-start w-full">
                        <Actions />
                        <div className="md:block hidden">
                            <WatchListStats />
                        </div>
                    </div>

                </div>
                <div className="flex flex-col gap-12">
                    <Title />
                    <NavBar />
                    {children}
                    <div className="md:hidden block">
                        <WatchListStats />
                    </div>
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;
