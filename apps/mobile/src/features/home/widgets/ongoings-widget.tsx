import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Tv } from 'lucide-react-native';

import { EPISODE_FORMS, getDeclensionWord, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import PosterRowSkeleton from '@/components/content-card/poster-row-skeleton';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';

import { flattenPages } from '../flatten-pages';
import { homeOngoingsOptions, ONGOINGS_SIZE } from '../queries';
import { useHomePreferences } from '../use-home-preferences';
import WidgetSection from '../widget-section';

const POSTER_CLASS = 'w-32';

const OngoingsWidget: FC = () => {
    const { titleLanguage, nameLanguage } = useHomePreferences();
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeOngoingsOptions(),
    );
    const list = flattenPages(data);

    return (
        <WidgetSection title="Онґоїнґи" href="/(tabs)/(catalog)">
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {isPending && (
                <PosterRowSkeleton
                    count={ONGOINGS_SIZE}
                    subtitles
                    itemClassName={POSTER_CLASS}
                />
            )}
            {list && list.length > 0 && (
                <PosterRow
                    items={list}
                    keyExtractor={(anime) => anime.slug}
                    itemClassName={POSTER_CLASS}
                    renderItem={(anime) => (
                        <PosterCard
                            href={`/anime/${anime.slug}`}
                            image={anime.image}
                            title={getTitle(anime, titleLanguage, nameLanguage)}
                            leftSubtitle={`${anime.episodes_released ?? 0} / ${anime.episodes_total ?? '?'} ${getDeclensionWord(anime.episodes_total ?? 0, EPISODE_FORMS)}`}
                        />
                    )}
                />
            )}
            {list?.length === 0 && (
                <EmptyState
                    size="sm"
                    icon={<Icon as={Tv} />}
                    title="Не знайдено сезонних онґоїнґів"
                    description="Сезон ще не почався або поки немає достатньо оцінених тайтлів"
                />
            )}
        </WidgetSection>
    );
};

export default OngoingsWidget;
