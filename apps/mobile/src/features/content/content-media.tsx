import { type FC, useState } from 'react';

import { Music, Play } from 'lucide-react-native';
import { View } from 'react-native';

import {
    type AnimeInfoResponse,
    type AnimeOstResponse,
    type AnimeVideoResponse,
    ContentTypeEnum,
} from '@hikka/api';
import {
    getYouTubeThumbnail,
    OST,
    readYouTubeVideo,
    VIDEO,
    youTubeWatchUrl,
} from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import { Header, HeaderTitle } from '@/components/ui/header';
import { Icon } from '@/components/ui/icon';
import SegmentedControl from '@/components/ui/segmented-control';

import { useVisibleOnce } from './detail-scroll';
import { openWebLink } from './open-web-link';
import type { ContentInfo } from './queries';

type MediaTab = 'video' | 'music';

const TABS = [
    { label: 'Відео', value: 'video' },
    { label: 'Музика', value: 'music' },
] as const;

// The web's media cards: 1.7 for video thumbnails, square for soundtracks.
const VIDEO_RATIO = 1.7;
const OST_RATIO = 1;

const openVideo = (url: string) => {
    const video = readYouTubeVideo(url);
    openWebLink(video ? youTubeWatchUrl(video.id, video.start) : url);
};

const VideoCard: FC<{ video: AnimeVideoResponse }> = ({ video }) => {
    const id = readYouTubeVideo(video.url)?.id ?? null;

    return (
        <PosterCard
            title={video.title}
            description={
                VIDEO[video.video_type].title_ua ||
                VIDEO[video.video_type].title_en
            }
            image={getYouTubeThumbnail(id, 'high') ?? undefined}
            containerRatio={VIDEO_RATIO}
            containerClassName="border border-border"
            onPress={() => openVideo(video.url)}
        >
            <View className="absolute inset-0 items-center justify-center">
                <View className="h-8 w-11 items-center justify-center rounded-lg bg-black/70">
                    <Icon as={Play} className="size-4 text-white" />
                </View>
            </View>
        </PosterCard>
    );
};

const OstCard: FC<{ ost: AnimeOstResponse }> = ({ ost }) => {
    const spotify = ost.spotify;

    return (
        <PosterCard
            title={ost.title}
            description={
                OST[ost.ost_type].title_ua || OST[ost.ost_type].title_en
            }
            image={<Icon as={Music} className="size-9 text-muted-foreground" />}
            containerRatio={OST_RATIO}
            containerClassName="border border-border"
            onPress={spotify ? () => openWebLink(spotify) : undefined}
        />
    );
};

const AnimeMedia: FC<{ anime: AnimeInfoResponse }> = ({ anime }) => {
    const { onLayout, visible } = useVisibleOnce();
    const [active, setActive] = useState<MediaTab>('video');
    const hasVideo = anime.videos.length > 0;
    const hasMusic = anime.ost.length > 0;

    if (!hasVideo && !hasMusic) return null;

    const tab: MediaTab =
        hasVideo && (active === 'video' || !hasMusic) ? 'video' : 'music';

    return (
        <View className="gap-3" onLayout={onLayout}>
            <Header>
                <HeaderTitle>Медіа</HeaderTitle>
            </Header>
            {hasVideo && hasMusic && (
                <SegmentedControl
                    options={TABS}
                    value={tab}
                    onValueChange={setActive}
                />
            )}
            {tab === 'video' ? (
                <PosterRow<AnimeVideoResponse>
                    items={visible ? anime.videos : undefined}
                    itemClassName="w-56"
                    skeleton={{
                        count: anime.videos.length,
                        description: true,
                        containerRatio: VIDEO_RATIO,
                    }}
                    keyExtractor={(video) => video.url}
                    renderItem={(video) => <VideoCard video={video} />}
                />
            ) : (
                <PosterRow<AnimeOstResponse>
                    items={visible ? anime.ost : undefined}
                    skeleton={{
                        count: anime.ost.length,
                        description: true,
                        containerRatio: OST_RATIO,
                    }}
                    keyExtractor={(ost) => `${ost.index}-${ost.title}`}
                    renderItem={(ost) => <OstCard ost={ost} />}
                />
            )}
        </View>
    );
};

type Props = {
    content: ContentInfo;
};

/** The web's anime `ContentMedia`: videos and soundtracks; thumbnails load once the section nears the viewport. */
const ContentMedia: FC<Props> = ({ content }) =>
    content.data_type === ContentTypeEnum.ANIME ? (
        <AnimeMedia anime={content} />
    ) : null;

export default ContentMedia;
