'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import EntryCard from '@/app/components/EntryCard';
import getAnimeInfo from '@/utils/api/anime/getAnimeInfo';
import LibraryMusic from '@/app/components/icons/LibraryMusic';
import { OST, VIDEO } from '@/utils/constants';
import { useState } from 'react';
import clsx from 'clsx';
import OndemandVideo from '@/app/components/icons/OndemandVideo';

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
            <div className="flex gap-8 items-center">
                <h3>Медіа</h3>
                <div className="flex gap-2">
                    {data.videos.length > 0 && (
                        <button
                            onClick={() => setActive('video')}
                            className={clsx(
                                'btn btn-sm btn-ghost rounded-full',
                                active === 'video' && 'btn-active',
                            )}
                        >
                            Відео
                        </button>
                    )}
                    {data.ost.length > 0 && (
                        <button
                            onClick={() => setActive('music')}
                            className={clsx(
                                'btn btn-sm btn-ghost rounded-full',
                                active === 'music' && 'btn-active',
                            )}
                        >
                            Музика
                        </button>
                    )}
                </div>
            </div>
            <div
                className={clsx(
                    'grid gap-4',
                    active === 'music'
                        ? 'md:grid-cols-6 grid-cols-3'
                        : 'md:grid-cols-4 grid-cols-2',
                )}
            >
                {active === 'music' &&
                    filteredOSTData.map((ost) => (
                        <EntryCard
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
                            <div className="flex h-full w-full text-4xl items-center justify-center">
                                <LibraryMusic className="text-secondary" />
                            </div>
                        </EntryCard>
                    ))}
                {active === 'video' &&
                    filteredVideoData.map((video) => {
                        const thumb = getYoutubeThumb(video.url);

                        return (
                            <EntryCard
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
                                    <div className="flex h-full w-full text-4xl items-center justify-center">
                                        <OndemandVideo className="text-secondary" />
                                    </div>
                                )}
                            </EntryCard>
                        );
                    })}
            </div>
        </div>
    );
};

export default Component;
