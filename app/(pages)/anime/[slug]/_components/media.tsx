'use client';

import { useState } from 'react';
import IcBaselineLibraryMusic from '~icons/ic/baseline-library-music';
import IcBaselineOndemandVideo from '~icons/ic/baseline-ondemand-video';

import { useParams } from 'next/navigation';

import EntryCard from '@/components/entry-card/entry-card';
import SubHeader from '@/components/sub-header';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import useAnimeInfo from '@/services/hooks/anime/useAnimeInfo';
import { cn } from '@/utils';
import { OST, VIDEO } from '@/utils/constants';

interface Props {
    extended?: boolean;
}

const Component = ({ extended }: Props) => {
    const params = useParams();
    const { data: anime } = useAnimeInfo({ slug: String(params.slug) });
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
                <ToggleGroup
                    type="single"
                    value={active}
                    onValueChange={(value: 'video' | 'music') =>
                        setActive(value)
                    }
                    variant="outline"
                    size="badge"
                >
                    {anime.videos.length > 0 && (
                        <ToggleGroupItem value="video" aria-label="Відео">
                            Відео
                        </ToggleGroupItem>
                    )}
                    {anime.ost.length > 0 && (
                        <ToggleGroupItem value="music" aria-label="Музика">
                            Музика
                        </ToggleGroupItem>
                    )}
                </ToggleGroup>
            </SubHeader>
            <div
                className={cn(
                    'grid gap-4 lg:gap-8',
                    !extended && 'grid-flow-col overflow-x-auto no-scrollbar -mx-4 px-4',
                    active === 'music' && extended && 'grid-cols-3 md:grid-cols-6',
                    active === 'music' && !extended && 'grid-cols-scroll-4 md:grid-cols-4',
                    active === 'video' && extended && 'grid-cols-2 md:grid-cols-4',
                    active === 'video' && !extended &&  'grid-cols-scroll-3 grid-min-10 md:grid-cols-3',
                )}
            >
                {active === 'music' &&
                    filteredOSTData.map((ost) => (
                        <EntryCard
                            target="_blank"
                            key={ost.spotify}
                            href={ost.spotify || undefined}
                            title={ost.title}
                            containerRatio={1}
                            description={
                                OST[ost.ost_type].title_ua ||
                                OST[ost.ost_type].title_en
                            }
                        >
                            <div className="absolute left-0 top-0 flex size-full items-center justify-center text-4xl">
                                <IcBaselineLibraryMusic className="text-muted-foreground" />
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
                                containerRatio={1.7}
                                description={
                                    VIDEO[video.video_type].title_ua ||
                                    VIDEO[video.video_type].title_en
                                }
                            >
                                {!thumb && (
                                    <div className="absolute left-0 top-0 flex size-full items-center justify-center text-4xl">
                                        <IcBaselineOndemandVideo className="text-muted-foreground" />
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
