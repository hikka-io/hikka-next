'use client';

import { useParams } from 'next/navigation';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import getAnimeInfo, {Response as AnimeInfoResponse} from '@/utils/api/anime/getAnimeInfo';
import IcBaselineLibraryMusic from '~icons/ic/baseline-library-music';
import { OST, VIDEO } from '@/utils/constants';
import { useState } from 'react';
import clsx from 'clsx';
import IcBaselineOndemandVideo from '~icons/ic/baseline-ondemand-video';
import BaseCard from '@/app/_components/BaseCard';
import SubHeader from '@/app/_components/SubHeader';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const queryClient = useQueryClient();
    const params = useParams();
    const anime: AnimeInfoResponse | undefined = queryClient.getQueryData([
        'anime',
        params.slug,
    ]);
    const [active, setActive] = useState<'video' | 'music'>(
        anime?.videos && anime.videos.length === 0 ? 'music' : 'video',
    );

    if (!anime || (anime.ost.length === 0 && anime.videos.length === 0)) {
        return null;
    }

    const getYoutubeThumb = (url: string) => {
        const parsed = url.split('/');

        if (parsed.length > 0) {
            return `https://img.youtube.com/vi/${
                parsed[parsed.length - 1]
            }/mqdefault.jpg`;
        }

        return undefined;
    };

    const filteredOSTData = extended ? anime.ost : anime.ost.slice(0, 4);
    const filteredVideoData = extended ? anime.videos : anime.videos.slice(0, 3);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Медіа"
                href={!extended ? params.slug + '/media' : undefined}
            >
                <div className="flex gap-4">
                    {anime.videos.length > 0 && (
                        <button
                            onClick={() => setActive('video')}
                            className={clsx(
                                'btn btn-badge btn-ghost rounded-full',
                                active === 'video' && 'btn-active',
                            )}
                        >
                            Відео
                        </button>
                    )}
                    {anime.ost.length > 0 && (
                        <button
                            onClick={() => setActive('music')}
                            className={clsx(
                                'btn btn-badge btn-ghost rounded-full',
                                active === 'music' && 'btn-active',
                            )}
                        >
                            Музика
                        </button>
                    )}
                </div>
            </SubHeader>
            <div
                className={clsx(
                    'grid gap-4 lg:gap-8',
                    active === 'music'
                        ? extended ? 'md:grid-cols-6 grid-cols-3' : 'md:grid-cols-4 grid-cols-3'
                        : extended ? 'md:grid-cols-4 grid-cols-2' : 'md:grid-cols-3 grid-cols-2',
                )}
            >
                {active === 'music' &&
                    filteredOSTData.map((ost) => (
                        <BaseCard
                            target="_blank"
                            key={ost.spotify}
                            href={ost.spotify || '#'}
                            title={ost.title}
                            containerClassName="!pt-[100%] !bg-secondary/30"
                            desc={
                                OST[ost.ost_type].title_ua ||
                                OST[ost.ost_type].title_en
                            }
                        >
                            <div className="absolute top-0 left-0 flex h-full w-full text-4xl items-center justify-center">
                                <IcBaselineLibraryMusic className="text-neutral" />
                            </div>
                        </BaseCard>
                    ))}
                {active === 'video' &&
                    filteredVideoData.map((video) => {
                        const thumb = getYoutubeThumb(video.url);

                        return (
                            <BaseCard
                                target="_blank"
                                key={video.url}
                                href={video.url || '#'}
                                title={video.title}
                                poster={thumb}
                                containerClassName="!bg-secondary/30 !pt-[70%]"
                                desc={
                                    VIDEO[video.video_type].title_ua ||
                                    VIDEO[video.video_type].title_en
                                }
                            >
                                {!thumb && (
                                    <div className="absolute top-0 left-0 flex h-full w-full text-4xl items-center justify-center">
                                        <IcBaselineOndemandVideo className="text-neutral" />
                                    </div>
                                )}
                            </BaseCard>
                        );
                    })}
            </div>
        </div>
    );
};

export default Component;
