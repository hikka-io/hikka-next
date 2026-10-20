import { type FC, useEffect, useState } from 'react';

import { View } from 'react-native';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';
import { getOriginalTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { useTitle } from '@/services/session';
import { cn } from '@/utils/cn';

import ContentScores from './content-scores';
import type { ContentInfo } from './queries';
import TrackingSlot, { type ProgressTotals } from './tracking-slot';

const titleSizeClass = (title: string) =>
    title.length > 80
        ? 'text-lg leading-snug'
        : title.length > 40
          ? 'text-xl leading-snug'
          : 'text-2xl leading-8';

const progressTotals = (content: ContentInfo): ProgressTotals =>
    content.data_type === ContentTypeEnum.ANIME
        ? { episodes_total: content.episodes_total }
        : { chapters: content.chapters, volumes: content.volumes };

type Props = {
    contentType: MainContentTypeEnum;
    content: ContentInfo;
    onTitleBottom: (offset: number) => void;
};

const ContentHero: FC<Props> = ({ contentType, content, onTitleBottom }) => {
    const getTitle = useTitle();
    const [heroTop, setHeroTop] = useState<number | null>(null);
    const [titleBottom, setTitleBottom] = useState<number | null>(null);
    const title = getTitle(content);
    const originalTitle = getOriginalTitle(content);

    useEffect(() => {
        if (heroTop !== null && titleBottom !== null) {
            onTitleBottom(heroTop + titleBottom);
        }
    }, [heroTop, titleBottom, onTitleBottom]);

    return (
        <View
            className="gap-4"
            onLayout={(event) => setHeroTop(event.nativeEvent.layout.y)}
        >
            <PosterCard
                image={content.image ?? undefined}
                className="w-48 self-center"
            />
            <View
                onLayout={(event) => {
                    const { y, height } = event.nativeEvent.layout;
                    setTitleBottom(y + height);
                }}
            >
                <Text
                    selectable
                    accessibilityRole="header"
                    className={cn('font-bold', titleSizeClass(title))}
                >
                    {title}
                </Text>
                {originalTitle && (
                    <Text selectable className="text-muted-foreground text-sm">
                        {originalTitle}
                    </Text>
                )}
            </View>
            {content.genres.length > 0 && (
                <View className="flex-row flex-wrap gap-1.5">
                    {content.genres.map((genre) => (
                        <Badge key={genre.slug} variant="secondary">
                            {genre.name_ua ?? genre.name_en}
                        </Badge>
                    ))}
                </View>
            )}
            <ContentScores content={content} />
            <TrackingSlot
                contentType={contentType}
                slug={content.slug}
                totals={progressTotals(content)}
            />
        </View>
    );
};

export default ContentHero;
