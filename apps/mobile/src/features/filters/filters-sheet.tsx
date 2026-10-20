import type { FC } from 'react';

import { ScrollView, View } from 'react-native';

import { ContentTypeEnum } from '@hikka/api';
import {
    AGE_RATING,
    DATE_RANGE,
    getSeasonByOffset,
    MEDIA_TYPE_BY_CONTENT_TYPE,
    RELEASE_STATUS,
    SCORE_RANGE,
    SEASON,
    YEARS,
} from '@hikka/core';

import { Button } from '@/components/ui/button';
import { Header, HeaderActions, HeaderTitle } from '@/components/ui/header';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/features/auth';

import {
    useCatalogSearch,
    useUpdateCatalogSearch,
} from './catalog-search-store';
import ChipFilter from './chip-filter';
import {
    type CatalogSearch,
    type CatalogSearchKey,
    type CatalogType,
    clearFilters,
    cycleGenre,
    getActiveFilters,
    setParam,
    toggleValue,
} from './filter-params';
import GenreFilter from './genre-filter';
import RangeFilter from './range-filter';
import StudioFilter from './studio-filter';
import SwitchFilter from './switch-filter';

type Props = {
    type: CatalogType;
    onDone: () => void;
};

function formatSeasonOffset(offset: number) {
    const [season, year] = getSeasonByOffset(offset);

    return `${SEASON[season].title_ua} ${year}`;
}

/**
 * The web's filter panel for one content type, in the web's order. Changes apply live,
 * like the web; "Очистити" keeps the sort.
 */
const FiltersSheet: FC<Props> = ({ type, onDone }) => {
    const search = useCatalogSearch(type);
    const update = useUpdateCatalogSearch(type);
    const { hasToken } = useSession();
    const anime = type === ContentTypeEnum.ANIME;
    const dateRange = anime && Boolean(search.date_range_enabled);
    const filtered =
        getActiveFilters(search, { signedIn: hasToken }).length > 0;

    const change = <K extends CatalogSearchKey>(
        key: K,
        value: CatalogSearch[K] | null,
    ) => update((prev) => setParam(prev, key, value));

    const toggle =
        (key: 'statuses' | 'types' | 'seasons' | 'ratings' | 'studios') =>
        (value: string) =>
            update((prev) =>
                setParam(prev, key, toggleValue(prev[key], value)),
            );

    const genres = (
        <GenreFilter
            key="genres"
            selected={search.genres}
            onCycle={(slug) =>
                update((prev) =>
                    setParam(prev, 'genres', cycleGenre(prev.genres, slug)),
                )
            }
        />
    );
    const hideListed = hasToken ? (
        <SwitchFilter
            key="hide_listed"
            label="Приховати тайтли з мого списку"
            value={search.hide_listed}
            onChange={(value) => change('hide_listed', value)}
        />
    ) : null;
    const statuses = (
        <ChipFilter
            key="statuses"
            title="Статус"
            options={RELEASE_STATUS}
            selected={search.statuses}
            onToggle={toggle('statuses')}
        />
    );
    const mediaTypes = (
        <ChipFilter
            key="types"
            title="Тип"
            options={MEDIA_TYPE_BY_CONTENT_TYPE[type] ?? {}}
            selected={search.types}
            onToggle={toggle('types')}
        />
    );
    const score = (
        <RangeFilter
            key="score"
            title="Оцінка"
            bounds={SCORE_RANGE}
            value={search.score}
            onChange={(range) => change('score', range)}
        />
    );
    const years = dateRange ? null : (
        <RangeFilter
            key="years"
            title="Рік виходу"
            bounds={YEARS}
            value={search.years}
            onChange={(range) => change('years', range)}
        />
    );
    const translated = (
        <SwitchFilter
            key="only_translated"
            label="Перекладено українською"
            value={search.only_translated}
            onChange={(value) => change('only_translated', value)}
        />
    );

    const sections = anime
        ? [
              genres,
              <StudioFilter
                  key="studios"
                  selected={search.studios}
                  onToggle={toggle('studios')}
              />,
              hideListed,
              statuses,
              dateRange ? null : (
                  <ChipFilter
                      key="seasons"
                      title="Сезон"
                      options={SEASON}
                      selected={search.seasons}
                      onToggle={toggle('seasons')}
                  />
              ),
              mediaTypes,
              <ChipFilter
                  key="ratings"
                  title="Віковий рейтинг"
                  options={AGE_RATING}
                  selected={search.ratings}
                  onToggle={toggle('ratings')}
              />,
              score,
              years,
              <View key="date_range" className="gap-6">
                  <SwitchFilter
                      label="Часовий проміжок"
                      value={search.date_range_enabled}
                      onChange={(enabled) =>
                          update((prev) =>
                              setParam(
                                  setParam(
                                      prev,
                                      'date_range',
                                      enabled ? DATE_RANGE : null,
                                  ),
                                  'date_range_enabled',
                                  enabled,
                              ),
                          )
                      }
                  />
                  {dateRange ? (
                      <RangeFilter
                          title="Сезони"
                          bounds={DATE_RANGE}
                          value={search.date_range}
                          format={formatSeasonOffset}
                          onChange={(range) =>
                              change('date_range', range ?? DATE_RANGE)
                          }
                      />
                  ) : null}
              </View>,
              translated,
          ]
        : [statuses, genres, hideListed, mediaTypes, translated, score, years];

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="gap-6 px-4 pt-6 pb-10"
            keyboardShouldPersistTaps="handled"
        >
            <Header className="justify-between">
                <HeaderTitle size="section">Фільтри</HeaderTitle>
                <HeaderActions>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={!filtered}
                        onPress={() => update(clearFilters)}
                    >
                        Очистити
                    </Button>
                    <Button size="sm" onPress={onDone}>
                        Готово
                    </Button>
                </HeaderActions>
            </Header>
            {sections
                .filter((section) => section !== null)
                .map((section, index) => (
                    <View key={section.key} className="gap-6">
                        {index > 0 && <Separator />}
                        {section}
                    </View>
                ))}
        </ScrollView>
    );
};

export default FiltersSheet;
