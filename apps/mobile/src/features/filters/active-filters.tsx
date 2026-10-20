import type { FC } from 'react';

import * as Haptics from 'expo-haptics';
import { Star, X } from 'lucide-react-native';
import { ScrollView } from 'react-native';

import {
    type ActiveFilter,
    getActiveFilters,
    isTristateFilter,
    removeActiveFilter,
} from '@hikka/core';

import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { useSession } from '@/features/auth';

import {
    useCatalogSearch,
    useFilterNames,
    useUpdateCatalogSearch,
} from './catalog-search-store';
import {
    type CatalogSearch,
    type CatalogType,
    clearFilters,
} from './filter-params';
import { useGenres } from './use-genres';

type Props = {
    type: CatalogType;
};

function chipTone(filter: ActiveFilter) {
    if (!isTristateFilter(filter.param)) return undefined;

    return filter.excluded
        ? {
              className: 'border border-destructive-border bg-destructive',
              textClassName: 'text-destructive-foreground',
          }
        : {
              className: 'border border-success-border bg-success',
              textClassName: 'text-success-foreground',
          };
}

/** Whether any chip would show, so the toolbar and empty state can reflect it. */
export function hasActiveFilters(search: CatalogSearch, signedIn: boolean) {
    return getActiveFilters(search, { signedIn }).length > 0;
}

export function useHasActiveFilters(type: CatalogType) {
    const search = useCatalogSearch(type);
    const { hasToken } = useSession();

    return hasActiveFilters(search, hasToken);
}

/** The web's active-filter chips: tap one to remove it, "Очистити все" when there are several. */
const ActiveFilters: FC<Props> = ({ type }) => {
    const search = useCatalogSearch(type);
    const update = useUpdateCatalogSearch(type);
    const names = useFilterNames();
    const { hasToken } = useSession();
    const { data: genres } = useGenres(Boolean(search.genres?.length));

    const filters = getActiveFilters(search, {
        labelMaps: { genres: genres?.names, studios: names },
        signedIn: hasToken,
    });

    if (filters.length === 0) return null;

    const remove = (filter: ActiveFilter) => {
        Haptics.selectionAsync();
        update((prev) => removeActiveFilter(prev, filter));
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4"
        >
            {filters.length > 1 && (
                <Chip
                    className="bg-secondary"
                    accessibilityLabel="Очистити всі фільтри"
                    onPress={() => {
                        Haptics.selectionAsync();
                        update(clearFilters);
                    }}
                >
                    Очистити все
                </Chip>
            )}
            {filters.map((filter) => {
                const tone = chipTone(filter);

                return (
                    <Chip
                        key={`${filter.param}:${filter.value}`}
                        selected
                        className={tone?.className}
                        textClassName={tone?.textClassName}
                        accessibilityLabel={`Прибрати фільтр ${filter.label}`}
                        onPress={() => remove(filter)}
                    >
                        {filter.param === 'score' && <Icon as={Star} />}
                        {filter.label}
                        <Icon as={X} />
                    </Chip>
                );
            })}
        </ScrollView>
    );
};

export default ActiveFilters;
