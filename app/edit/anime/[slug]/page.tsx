import AnimeEditNew from './_layout/AnimeEditNew';
import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import RQHydrate from '@/utils/RQHydrate';
import AnimeContent from "./_layout/AnimeContent";

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
            <div className="grid lg:grid-cols-[1fr_25%] grid-cols-1 lg:gap-16 gap-12">
                <AnimeEditNew />
                <div className="flex flex-col gap-12">
                    <AnimeContent />
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;
