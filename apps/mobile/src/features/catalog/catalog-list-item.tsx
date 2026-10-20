import type { FC } from 'react';

import { Star } from 'lucide-react-native';
import { View } from 'react-native';

import { type ContentStatusEnum, ContentTypeEnum } from '@hikka/api';
import {
    formatCompactNumber,
    getMediaTypeLabel,
    getTitle,
    RELEASE_STATUS,
} from '@hikka/core';

import {
    HorizontalCard,
    HorizontalCardContainer,
    HorizontalCardDescription,
    HorizontalCardImage,
    HorizontalCardTitle,
} from '@/components/horizontal-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DENSE_MAX_FONT_SCALE } from '@/components/ui/typography';
import { contentHref } from '@/utils/content-href';

import type { CatalogItem } from './queries';

const GENRE_LIMIT = 2;

type ScoreSourceProps = {
    label: string;
    score: number;
    scoredBy: number;
};

const ScoreSource: FC<ScoreSourceProps> = ({ label, score, scoredBy }) => {
    if (score <= 0) return null;

    return (
        <View className="flex-row items-center gap-1">
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="font-medium text-muted-foreground text-xs"
            >
                {label}
            </Text>
            <Text
                maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                className="font-bold text-sm"
            >
                {score}
            </Text>
            <Icon as={Star} className="size-3 text-muted-foreground" />
            {scoredBy > 0 ? (
                <Text
                    maxFontSizeMultiplier={DENSE_MAX_FONT_SCALE}
                    className="text-muted-foreground text-xs"
                >
                    {formatCompactNumber(scoredBy)}
                </Text>
            ) : null}
        </View>
    );
};

type Props = {
    item: CatalogItem;
};

function joinMeta(parts: (string | null | undefined)[]) {
    return parts.filter(Boolean).join(' · ');
}

/** The web's `CatalogListItem`: company, type · year · status, genres and both scores. */
const CatalogListItem: FC<Props> = ({ item }) => {
    const company =
        item.data_type === ContentTypeEnum.ANIME
            ? item.studios[0]?.name
            : item.magazines[0]?.name_en;
    const status = item.status
        ? RELEASE_STATUS[item.status as ContentStatusEnum]?.title_ua
        : undefined;
    const meta = joinMeta([
        getMediaTypeLabel(item.media_type),
        item.year ? String(item.year) : null,
        status,
    ]);
    const genres = joinMeta(
        item.genres
            .slice(0, GENRE_LIMIT)
            .map((genre) => genre.name_ua || genre.name_en),
    );

    return (
        <HorizontalCard
            href={contentHref(item.data_type, item.slug)}
            className="px-4 py-2"
        >
            <HorizontalCardImage image={item.image} className="w-16" />
            <HorizontalCardContainer className="gap-1.5">
                {company ? (
                    <Text
                        numberOfLines={1}
                        className="text-muted-foreground text-xs"
                    >
                        {company}
                    </Text>
                ) : null}
                <HorizontalCardTitle className="text-base">
                    {getTitle(item)}
                </HorizontalCardTitle>
                {meta ? (
                    <HorizontalCardDescription>
                        {meta}
                    </HorizontalCardDescription>
                ) : null}
                {genres ? (
                    <HorizontalCardDescription>
                        {genres}
                    </HorizontalCardDescription>
                ) : null}
                <View className="flex-row items-center gap-3">
                    <ScoreSource
                        label="MAL"
                        score={item.score}
                        scoredBy={item.scored_by}
                    />
                    <ScoreSource
                        label="Hikka"
                        score={item.native_score}
                        scoredBy={item.native_scored_by}
                    />
                </View>
            </HorizontalCardContainer>
        </HorizontalCard>
    );
};

export default CatalogListItem;
