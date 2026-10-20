import { type FC, type ReactElement, type SVGProps, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';

import {
    CompanyTypeEnum,
    genresOptions,
    searchCompaniesInfiniteOptions,
} from '@hikka/api';
import {
    type ActiveFilter as CoreActiveFilter,
    getActiveFilters,
    isTristateFilter,
    removeActiveFilter,
} from '@hikka/core';

import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '@/services/session';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { cn } from '@/utils/cn';
import { useRouteSearch } from '@/utils/navigation';

import { useClearFilters } from './use-clear-filters';

export type ActiveFilter = CoreActiveFilter & {
    icon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
};

/** Range chips that carry an icon. */
const FILTER_ICONS: Record<string, ActiveFilter['icon']> = {
    score: MaterialSymbolsStarRounded,
};

/** Derives human-readable active filters (+ count, clearAll) from URL params and dynamic label maps. */
export function useActiveFilters() {
    const router = useRouter();
    const search = useRouteSearch();
    const { user } = useSession();

    const hasGenres = 'genres' in search;
    const hasStudios = 'studios' in search;

    const { data: genreMap } = useQuery({
        ...genresOptions(),
        enabled: hasGenres,
        select: (data) => {
            const map: Record<string, string> = {};
            data.list.forEach((genre) => {
                map[genre.slug] = genre.name_ua || genre.name_en || genre.slug;
            });
            return map;
        },
    });

    const { list: studioList } = useInfiniteList(
        searchCompaniesInfiniteOptions({
            body: { type: CompanyTypeEnum.STUDIO },
        }),
        { enabled: hasStudios },
    );

    const studioMap = useMemo(() => {
        if (!studioList) return undefined;
        const map: Record<string, string> = {};
        studioList.forEach((studio) => {
            map[studio.slug] = studio.name;
        });
        return map;
    }, [studioList]);

    const dynamicLabelMaps: Record<string, Record<string, string> | undefined> =
        useMemo(
            () => ({
                genres: genreMap,
                studios: studioMap,
            }),
            [genreMap, studioMap],
        );

    const filters = useMemo<ActiveFilter[]>(
        () =>
            getActiveFilters(search, {
                labelMaps: dynamicLabelMaps,
                signedIn: Boolean(user),
            }).map((filter) => {
                const icon = FILTER_ICONS[filter.param];

                return icon ? { ...filter, icon } : filter;
            }),
        [search, dynamicLabelMaps, user],
    );

    const removeFilter = (filter: ActiveFilter) => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) =>
                removeActiveFilter(prev, filter),
            replace: true,
        } as any);
    };

    const clearAll = useClearFilters({
        preserve: ['search', 'sort', 'order', 'tab'],
    });

    return { filters, count: filters.length, removeFilter, clearAll };
}

type Props = {
    className?: string;
};

const ActiveFilters: FC<Props> = ({ className }) => {
    const { filters, clearAll, removeFilter } = useActiveFilters();

    if (filters.length === 0) return null;

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-2 border-l pl-4',
                className,
            )}
        >
            {filters.map((filter, idx) => {
                const isTriState = isTristateFilter(filter.param);
                const variant = isTriState
                    ? filter.excluded
                        ? 'destructive'
                        : 'success'
                    : 'outline';

                return (
                    <Badge
                        key={`${filter.param}-${filter.value}-${idx}`}
                        variant={variant}
                        className={cn(
                            'group h-6 gap-1.5 pr-1.5 pl-2.5',
                            !isTriState &&
                                'border-border bg-background dark:border-input dark:bg-input/30',
                        )}
                    >
                        {filter.icon && (
                            <filter.icon className="size-3 shrink-0" />
                        )}
                        <span className="truncate">{filter.label}</span>
                        <button
                            type="button"
                            aria-label={`Видалити фільтр ${filter.label}`}
                            className="-mr-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full transition hover:bg-foreground/10"
                            onClick={() => removeFilter(filter)}
                        >
                            <XIcon className="size-3" />
                        </button>
                    </Badge>
                );
            })}
            {filters.length > 1 && (
                <Button
                    variant="ghost"
                    size="xs"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={clearAll}
                >
                    Очистити все
                </Button>
            )}
        </div>
    );
};

export default ActiveFilters;
