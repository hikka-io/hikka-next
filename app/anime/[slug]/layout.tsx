import getQueryClient from '@/utils/getQueryClient';
import { dehydrate } from '@tanstack/query-core';
import RQHydrate from '@/utils/RQHydrate';
import getAnimeInfo, {
    Response as AnimeResponse,
} from '@/utils/api/anime/getAnimeInfo';
import Actions from '@/app/anime/[slug]/_layout/Actions';
import { PropsWithChildren } from 'react';
import Title from '@/app/anime/[slug]/_layout/Title';
import getAnimeCharacters from '@/utils/api/anime/getAnimeCharacters';
import NavBar from '@/app/anime/[slug]/_layout/NavBar';
import getAnimeFranchise from '@/utils/api/anime/getAnimeFranchise';
import getAnimeStaff from '@/utils/api/anime/getAnimeStaff';
import WatchListStats from '@/app/anime/[slug]/_layout/WatchListStats';
import Cover from '@/app/anime/[slug]/_layout/Cover';
import { Metadata, ResolvingMetadata } from 'next';

interface Props extends PropsWithChildren {
    params: { slug: string };
}

export async function generateMetadata(
    { params }: { params: { slug: string } },
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
        synopsis && (synopsis.length > 150
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

    await queryClient.prefetchQuery(['anime', slug], () =>
        getAnimeInfo({ slug }),
    );
    await queryClient.prefetchInfiniteQuery(['characters', slug], () =>
        getAnimeCharacters({ slug }),
    );

    await queryClient.prefetchInfiniteQuery(['franchise', slug], () =>
        getAnimeFranchise({ slug }),
    );
    await queryClient.prefetchInfiniteQuery(['staff', slug], () =>
        getAnimeStaff({ slug }),
    );

    const dehydratedState = dehydrate(queryClient);

    return (
        <RQHydrate state={dehydratedState}>
            <div className="inline-grid grid-cols-1 lg:grid-cols-[25%_1fr] lg:gap-16 gap-12">
                <div className="flex flex-col gap-4">
                    <Cover />
                    <div className="flex flex-col gap-12 lg:sticky lg:top-20 lg:self-start w-full">
                        <Actions />
                        <div className="lg:block hidden">
                            <WatchListStats />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <Title />
                    <NavBar />
                    {children}
                    <div className="lg:hidden block">
                        <WatchListStats />
                    </div>
                </div>
            </div>
        </RQHydrate>
    );
};

export default Component;
