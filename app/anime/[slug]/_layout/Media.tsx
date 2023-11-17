'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
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
    const params = useParams();
    const { data } = useQuery({
        queryKey: ['anime', params.slug],
        queryFn: () => getAnimeInfo({ slug: String(params.slug) }),
    });
    const [active, setActive] = useState<'video' | 'music'>(
        data?.videos && data.videos.length === 0 ? 'music' : 'video',
    );

    if (!data || (data.ost.length === 0 && data.videos.length === 0)) {
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

    const filteredOSTData = extended ? data.ost : data.ost.slice(0, 6);
    const filteredVideoData = extended ? data.videos : data.videos.slice(0, 4);

    return (
        <div className="flex flex-col gap-8">
            <SubHeader
                title="Медіа"
                href={!extended ? params.slug + '/media' : undefined}
            />
            <div
                className={clsx(
                    'grid gap-4 md:gap-8',
                    active === 'music'
                        ? 'md:grid-cols-6 grid-cols-3'
                        : 'md:grid-cols-4 grid-cols-2',
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
