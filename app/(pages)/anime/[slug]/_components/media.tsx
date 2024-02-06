'use client';

import clsx from 'clsx';
import { useState } from 'react';
import IcBaselineLibraryMusic from '~icons/ic/baseline-library-music';
import IcBaselineOndemandVideo from '~icons/ic/baseline-ondemand-video';

import { useParams } from 'next/navigation';

import { useAnimeInfo } from '@/app/page.hooks';
import SubHeader from '@/app/_components/sub-header';
import BaseCard from '@/app/_components/ui/base-card';
import { Button } from '@/app/_components/ui/button';
import { OST, VIDEO } from '@/app/_utils/constants';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data: anime } = useAnimeInfo(String(params.slug));
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
    const filteredVideoData = extended
        ? anime.videos
        : anime.videos.slice(0, 3);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Медіа"
                href={!extended ? params.slug + '/media' : undefined}
            >
                <div className="flex gap-4">
                    {anime.videos.length > 0 && (
                        <Button
                            size="badge"
                            variant={
                                active === 'video' ? 'secondary' : 'outline'
                            }
                            onClick={() => setActive('video')}
                        >
                            Відео
                        </Button>
                    )}
                    {anime.ost.length > 0 && (
                        <Button
                            size="badge"
                            variant={
                                active === 'music' ? 'secondary' : 'outline'
                            }
                            onClick={() => setActive('music')}
                        >
                            Музика
                        </Button>
                    )}
                </div>
            </SubHeader>
            <div
                className={clsx(
                    'grid gap-4 lg:gap-8',
                    active === 'music'
                        ? extended
                            ? 'grid-cols-3 md:grid-cols-6'
                            : 'grid-cols-3 md:grid-cols-4'
                        : extended
                          ? 'grid-cols-2 md:grid-cols-4'
                          : 'grid-cols-2 md:grid-cols-3',
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
                            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-4xl">
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
                                    <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-4xl">
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