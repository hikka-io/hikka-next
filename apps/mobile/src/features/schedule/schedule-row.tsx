import { type FC, memo } from 'react';

import { View } from 'react-native';

import type { AnimeScheduleResponse } from '@hikka/api';
import {
    formatHistoryTime,
    getScheduleDuration,
    getTitle,
    type NameLanguage,
    type TitleLanguage,
} from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { IconStatusButton } from '@/components/tracking';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { cn } from '@/utils/cn';
import { contentHref } from '@/utils/content-href';

type Props = {
    item: AnimeScheduleResponse;
    titleLanguage?: TitleLanguage;
    nameLanguage?: NameLanguage;
};

/** The web's `ScheduleItem`: poster, title, episode of total, when it airs, and the viewer's list status. */
const ScheduleRow: FC<Props> = ({ item, titleLanguage, nameLanguage }) => {
    const { anime } = item;
    const aired = item.time_left <= 0;

    return (
        <HorizontalCard
            href={contentHref('anime', anime.slug)}
            className="px-4 py-2"
            action={
                <IconStatusButton
                    contentType="anime"
                    slug={anime.slug}
                    entry={anime.watch[0] ?? null}
                />
            }
        >
            <HorizontalCardImage image={anime.image} className="w-16" />
            <HorizontalCardContainer className="gap-1.5">
                <HorizontalCardTitle className="text-base">
                    {getTitle(anime, titleLanguage, nameLanguage)}
                </HorizontalCardTitle>
                <HorizontalCardDescription>
                    <Text>
                        Епізод{' '}
                        <Text className="font-bold text-foreground">
                            {item.episode}
                        </Text>
                        /{anime.episodes_total || '?'}
                    </Text>
                </HorizontalCardDescription>
                <View className="flex-row items-baseline gap-2">
                    <Text
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className={cn(
                            'font-bold text-sm tabular-nums',
                            aired && 'text-muted-foreground',
                        )}
                    >
                        {formatHistoryTime(item.airing_at)}
                    </Text>
                    <Text
                        numberOfLines={1}
                        maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                        className="shrink text-muted-foreground text-xs"
                    >
                        {getScheduleDuration(item.airing_at, item.time_left)}
                    </Text>
                </View>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default memo(ScheduleRow);
