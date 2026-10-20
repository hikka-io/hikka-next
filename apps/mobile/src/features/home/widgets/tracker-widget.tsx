import { type FC, useState } from 'react';

import { useInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Play } from 'lucide-react-native';
import { View } from 'react-native';

import { ReadContentTypeEnum } from '@hikka/api';
import {
    CHAPTER_FORMS,
    EPISODE_FORMS,
    getDeclensionWord,
    getTitle,
} from '@hikka/core';

import PosterCard from '@/components/content-card/poster-card';
import PosterRow from '@/components/content-card/poster-row';
import PosterRowSkeleton from '@/components/content-card/poster-row-skeleton';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/ui/empty-state';
import ErrorState from '@/components/ui/error-state';
import { Icon } from '@/components/ui/icon';

import ChipTabs from '../chip-tabs';
import { flattenPages } from '../flatten-pages';
import { homeReadingOptions, homeWatchingOptions } from '../queries';
import type { TrackerTab } from '../types';
import { useHomePreferences } from '../use-home-preferences';
import WidgetSection from '../widget-section';

const POSTER_CLASS = 'w-32';

const TABS: { value: TrackerTab; label: string }[] = [
    { value: 'anime', label: 'Аніме' },
    { value: 'manga', label: 'Манґа' },
    { value: 'novel', label: 'Ранобе' },
];

const SKELETON_SIZE = 4;

type TrackerItem = {
    slug: string;
    image: string | null;
    title: string;
    current: number;
    total: number | null;
    unit: readonly [string, string, string];
};

type Props = {
    username: string;
};

const useTrackerItems = (tab: TrackerTab, username: string) => {
    const { titleLanguage, nameLanguage } = useHomePreferences();
    const watching = useInfiniteQuery({
        ...homeWatchingOptions(username),
        enabled: tab === 'anime',
    });
    const reading = useInfiniteQuery({
        ...homeReadingOptions(
            tab === 'novel'
                ? ReadContentTypeEnum.NOVEL
                : ReadContentTypeEnum.MANGA,
            username,
        ),
        enabled: tab !== 'anime',
    });

    const query = tab === 'anime' ? watching : reading;
    const items: TrackerItem[] | undefined =
        tab === 'anime'
            ? flattenPages(watching.data)?.map((entry) => ({
                  slug: entry.anime.slug,
                  image: entry.anime.image,
                  title: getTitle(entry.anime, titleLanguage, nameLanguage),
                  current: entry.episodes,
                  total: entry.anime.episodes_total,
                  unit: EPISODE_FORMS,
              }))
            : flattenPages(reading.data)?.map((entry) => ({
                  slug: entry.content.slug,
                  image: entry.content.image,
                  title: getTitle(entry.content, titleLanguage, nameLanguage),
                  current: entry.chapters,
                  total: entry.content.chapters,
                  unit: CHAPTER_FORMS,
              }));

    return {
        items,
        isPending: query.isPending && query.fetchStatus !== 'idle',
        isError: query.isError,
        refetch: query.refetch,
    };
};

const ProgressBar: FC<{ current: number; total: number | null }> = ({
    current,
    total,
}) => {
    if (!total) return null;

    return (
        <View className="absolute inset-x-0 bottom-0 h-1 bg-black/40">
            <View
                className="h-full bg-primary-foreground"
                style={{
                    width: `${Math.min(100, (current / total) * 100)}%`,
                }}
            />
        </View>
    );
};

const TrackerPosterSkeleton: FC = () => (
    <PosterRowSkeleton
        count={SKELETON_SIZE}
        subtitles
        itemClassName={POSTER_CLASS}
    />
);

export const TrackerWidgetSkeleton: FC = () => {
    return (
        <WidgetSection title="Дивлюсь">
            <ChipTabs options={TABS} value="anime" onChange={() => {}} />
            <TrackerPosterSkeleton />
        </WidgetSection>
    );
};

const TrackerWidget: FC<Props> = ({ username }) => {
    const [tab, setTab] = useState<TrackerTab>('anime');
    const { items, isPending, isError, refetch } = useTrackerItems(
        tab,
        username,
    );

    return (
        <WidgetSection
            title={tab === 'anime' ? 'Дивлюсь' : 'Читаю'}
            href={`/u/${username}`}
        >
            <ChipTabs options={TABS} value={tab} onChange={setTab} />
            {isError && <ErrorState variant="section" onRetry={refetch} />}
            {isPending && <TrackerPosterSkeleton />}
            {items && items.length > 0 && (
                <PosterRow
                    items={items}
                    keyExtractor={(item) => item.slug}
                    itemClassName={POSTER_CLASS}
                    renderItem={(item) => (
                        <PosterCard
                            href={`/${tab}/${item.slug}`}
                            image={item.image ?? undefined}
                            title={item.title}
                            leftSubtitle={`${item.current} / ${item.total ?? '?'} ${getDeclensionWord(item.total ?? 0, item.unit)}`}
                        >
                            <ProgressBar
                                current={item.current}
                                total={item.total}
                            />
                        </PosterCard>
                    )}
                />
            )}
            {items?.length === 0 && (
                <EmptyState
                    size="sm"
                    icon={<Icon as={Play} />}
                    title={
                        tab === 'anime'
                            ? 'Список Дивлюсь порожній'
                            : 'Список Читаю порожній'
                    }
                    description={
                        tab === 'anime'
                            ? 'Додайте аніме у список Дивлюсь'
                            : tab === 'manga'
                              ? 'Додайте манґу у список Читаю'
                              : 'Додайте ранобе у список Читаю'
                    }
                    action={
                        <Link href="/(tabs)/(catalog)" asChild>
                            <Button variant="secondary" size="md">
                                {tab === 'anime'
                                    ? 'Знайти аніме'
                                    : tab === 'manga'
                                      ? 'Знайти манґу'
                                      : 'Знайти ранобе'}
                            </Button>
                        </Link>
                    }
                />
            )}
        </WidgetSection>
    );
};

export default TrackerWidget;
