import { type FC, Fragment, type ReactNode, useState } from 'react';

import {
    BookType,
    Building2,
    Calendar,
    CalendarClock,
    CircleDashed,
    Clock8,
    Hash,
    Play,
    ShieldEllipsis,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import {
    type AnimeInfoResponse,
    ContentTypeEnum,
    type MangaInfoResponse,
    type NovelInfoResponse,
} from '@hikka/api';
import {
    AGE_RATING,
    findNextEpisode,
    formatEpisodeCount,
    formatEpisodeDuration,
    formatNextEpisodeDate,
    getMediaTypeLabel,
    getScheduleDuration,
    RELEASE_STATUS,
    SEASON,
} from '@hikka/core';

import { Badge } from '@/components/ui/badge';
import Card from '@/components/ui/card';
import Image from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { presetImageUrl } from '@/utils/image-presets';

import DetailRow from './detail-row';
import type { ContentInfo } from './queries';

type BadgeStatus = keyof typeof RELEASE_STATUS;

const DetailGroups: FC<{ groups: ReactNode[] }> = ({ groups }) => (
    <Card className="px-0">
        {groups.filter(Boolean).map((group, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: groups are a fixed, ordered list
            <Fragment key={index}>
                {index > 0 && <Separator />}
                <View className="gap-4 px-4">{group}</View>
            </Fragment>
        ))}
    </Card>
);

const StatusRow: FC<{ status: string | null }> = ({ status }) =>
    status && status in RELEASE_STATUS ? (
        <DetailRow icon={CircleDashed} title="Статус">
            <Badge variant="status" status={status as BadgeStatus}>
                {RELEASE_STATUS[status as BadgeStatus].title_ua}
            </Badge>
        </DetailRow>
    ) : null;

const SYNONYMS_PREVIEW = 3;

const SynonymsRow: FC<{ synonyms: string[] }> = ({ synonyms }) => {
    const [expanded, setExpanded] = useState(false);
    const hidden = synonyms.length - SYNONYMS_PREVIEW;
    const preview = synonyms.slice(0, SYNONYMS_PREVIEW).join(', ');

    if (hidden <= 0) {
        return <DetailRow icon={BookType} title="Синоніми" value={preview} />;
    }

    return (
        <DetailRow icon={BookType} title="Синоніми">
            <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                accessibilityHint={
                    expanded
                        ? undefined
                        : `Ще ${hidden}, торкніться, щоб показати`
                }
                onPress={() => setExpanded(!expanded)}
                className="min-h-11 justify-center active:opacity-70"
            >
                <Text className="text-right font-medium text-sm leading-tight">
                    {expanded ? synonyms.join(', ') : preview}
                    {!expanded && (
                        <Text className="font-medium text-muted-foreground text-sm">
                            {` +${hidden}`}
                        </Text>
                    )}
                </Text>
            </Pressable>
        </DetailRow>
    );
};

const WatchDetails: FC<{ content: AnimeInfoResponse }> = ({ content }) => {
    const nextEpisode = findNextEpisode(content.schedule);
    const studio = content.companies.find(
        (company) => company.type === 'studio',
    );
    const season = content.season
        ? (SEASON[content.season as keyof typeof SEASON]?.title_ua ??
          content.season)
        : null;
    const episodes = content.episodes_total ?? content.episodes_released;
    const showEpisodes =
        !!episodes && (content.media_type !== 'movie' || episodes > 1);
    const rating = content.rating
        ? AGE_RATING[content.rating as keyof typeof AGE_RATING]?.title_ua
        : undefined;

    return (
        <DetailGroups
            groups={[
                <Fragment key="main">
                    <DetailRow
                        icon={Play}
                        title="Тип"
                        value={getMediaTypeLabel(content.media_type)}
                    />
                    <StatusRow status={content.status} />
                    {season && (
                        <DetailRow
                            icon={Calendar}
                            title="Сезон/рік"
                            value={`${season} ${content.year ?? ''}`.trim()}
                        />
                    )}
                </Fragment>,
                (content.episodes_total || content.episodes_released) && (
                    <Fragment key="episodes">
                        {showEpisodes && (
                            <DetailRow
                                icon={Hash}
                                title="Епізоди"
                                value={formatEpisodeCount(
                                    content.status,
                                    content.episodes_released,
                                    content.episodes_total,
                                )}
                            />
                        )}
                        {nextEpisode && (
                            <DetailRow
                                icon={CalendarClock}
                                title="Наступний епізод"
                            >
                                <View className="items-end">
                                    <Text className="text-right font-medium text-sm leading-tight">
                                        {formatNextEpisodeDate(
                                            nextEpisode.airing_at,
                                        )}
                                    </Text>
                                    <Text className="text-right text-muted-foreground text-xs">
                                        {getScheduleDuration(
                                            nextEpisode.airing_at,
                                        )}
                                    </Text>
                                </View>
                            </DetailRow>
                        )}
                        <DetailRow
                            icon={Clock8}
                            title="Тривалість епізоду"
                            value={
                                content.duration
                                    ? formatEpisodeDuration(content.duration)
                                    : undefined
                            }
                        />
                    </Fragment>
                ),
                (rating || studio) && (
                    <Fragment key="rating">
                        <DetailRow
                            icon={ShieldEllipsis}
                            title="Рейтинг"
                            value={rating}
                        />
                        {studio && (
                            <DetailRow icon={Building2} title="Студія">
                                <View className="flex-1 flex-row items-start justify-end gap-2">
                                    <Text
                                        numberOfLines={2}
                                        className="shrink text-right font-medium text-sm leading-tight"
                                    >
                                        {studio.company.name}
                                    </Text>
                                    {studio.company.image && (
                                        <Image
                                            source={presetImageUrl(
                                                studio.company.image,
                                                'cardXs',
                                            )}
                                            contentFit="cover"
                                            accessibilityIgnoresInvertColors
                                            className="aspect-2/1 w-8 rounded-xs"
                                        />
                                    )}
                                </View>
                            </DetailRow>
                        )}
                    </Fragment>
                ),
                content.synonyms.length > 0 && (
                    <SynonymsRow key="synonyms" synonyms={content.synonyms} />
                ),
            ]}
        />
    );
};

const ReadDetails: FC<{ content: MangaInfoResponse | NovelInfoResponse }> = ({
    content,
}) => (
    <DetailGroups
        groups={[
            <Fragment key="main">
                <DetailRow
                    icon={Play}
                    title="Тип"
                    value={getMediaTypeLabel(content.media_type)}
                />
                <StatusRow status={content.status} />
                <DetailRow icon={Calendar} title="Рік" value={content.year} />
            </Fragment>,
            (content.chapters || content.volumes) && (
                <Fragment key="volumes">
                    <DetailRow
                        icon={Hash}
                        title="Розділи"
                        value={content.chapters}
                    />
                    <DetailRow
                        icon={Hash}
                        title="Томи"
                        value={content.volumes}
                    />
                </Fragment>
            ),
            content.magazines.length > 0 && (
                <DetailRow
                    key="magazines"
                    icon={Building2}
                    title="Видавець"
                    value={content.magazines
                        .map((magazine) => magazine.name_en)
                        .join(', ')}
                />
            ),
            content.synonyms.length > 0 && (
                <SynonymsRow key="synonyms" synonyms={content.synonyms} />
            ),
        ]}
    />
);

type Props = {
    content: ContentInfo;
};

const ContentDetails: FC<Props> = ({ content }) =>
    content.data_type === ContentTypeEnum.ANIME ? (
        <WatchDetails content={content} />
    ) : (
        <ReadDetails content={content} />
    );

export default ContentDetails;
