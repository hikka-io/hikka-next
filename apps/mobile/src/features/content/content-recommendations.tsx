import type { FC } from 'react';

import { useQuery } from '@tanstack/react-query';

import { type AnimeResponseWithWatch, ContentTypeEnum } from '@hikka/api';
import { getMediaTypeLabel, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import { contentHref } from '@/utils/content-href';

import { useVisibleOnce } from './detail-scroll';
import {
    animeRecommendationsPreviewOptions,
    type ContentInfo,
    RECOMMENDATIONS_PREVIEW_SIZE,
} from './queries';

type Props = {
    content: ContentInfo;
};

const ContentRecommendations: FC<Props> = ({ content }) => {
    const { onLayout, visible } = useVisibleOnce();
    const { data, isError, refetch } = useQuery({
        ...animeRecommendationsPreviewOptions(content.slug),
        enabled: visible,
    });

    if (data?.list.length === 0) {
        return null;
    }

    return (
        <PosterRow<AnimeResponseWithWatch>
            title="Рекомендації"
            items={data?.list}
            skeleton={{ count: RECOMMENDATIONS_PREVIEW_SIZE, subtitles: true }}
            error={isError}
            onRetry={refetch}
            onLayout={onLayout}
            keyExtractor={(anime) => anime.slug}
            renderItem={(anime) => (
                <PosterCard
                    title={getTitle(anime)}
                    image={anime.image ?? undefined}
                    leftSubtitle={getMediaTypeLabel(anime.media_type)}
                    rightSubtitle={anime.year ? String(anime.year) : null}
                    href={contentHref(ContentTypeEnum.ANIME, anime.slug)}
                />
            )}
        />
    );
};

export default ContentRecommendations;
