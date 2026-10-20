import type { FC } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Tv } from 'lucide-react-native';

import { EPISODE_FORMS, getDeclensionWord, getTitle } from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterCardSkeleton from '@/components/content-card/poster-card-skeleton';
import EmptyState from '@/components/ui/empty-state';
import { Icon } from '@/components/ui/icon';

import { flattenPages } from '../flatten-pages';
import { PosterRow, PosterRowItem } from '../poster-row';
import { homeOngoingsOptions, ONGOINGS_SIZE } from '../queries';
import { useHomePreferences } from '../use-home-preferences';
import WidgetError from '../widget-error';
import WidgetSection from '../widget-section';

const OngoingsWidget: FC = () => {
    const { titleLanguage, nameLanguage } = useHomePreferences();
    const { data, isPending, isError, refetch } = useInfiniteQuery(
        homeOngoingsOptions(),
    );
    const list = flattenPages(data);

    return (
        <WidgetSection title="Онґоїнґи" href="/(tabs)/(catalog)">
            {isError && <WidgetError onRetry={refetch} />}
            {isPending && (
                <PosterRow>
                    {Array.from({ length: ONGOINGS_SIZE }, (_, index) => (
                        <PosterRowItem key={index}>
                            <PosterCardSkeleton />
                        </PosterRowItem>
                    ))}
                </PosterRow>
            )}
            {list && list.length > 0 && (
                <PosterRow>
                    {list.map((anime) => (
                        <PosterRowItem key={anime.slug}>
                            <PosterCard
                                href={`/anime/${anime.slug}`}
                                image={anime.image}
                                title={getTitle(
                                    anime,
                                    titleLanguage,
                                    nameLanguage,
                                )}
                                leftSubtitle={`${anime.episodes_released ?? 0} / ${anime.episodes_total ?? '?'} ${getDeclensionWord(anime.episodes_total ?? 0, EPISODE_FORMS)}`}
                            />
                        </PosterRowItem>
                    ))}
                </PosterRow>
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
