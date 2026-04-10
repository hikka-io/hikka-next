'use client';

import { CompanyTypeEnum } from '@hikka/client';
import { useGenres, useSearchCompanies } from '@hikka/react';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';
import { FC, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';
import {
    AGE_RATING,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants/common';

const STATIC_LABEL_MAPS: Record<
    string,
    Record<string, { title_ua: string }>
> = {
    statuses: RELEASE_STATUS,
    seasons: SEASON,
    types: MEDIA_TYPE,
    ratings: AGE_RATING,
};

const IGNORED_PARAMS = new Set(['page', 'search', 'order', 'sort']);

const SUBORDINATE_PARAMS = new Set(['date_range']);

const RANGE_PARAMS: Record<string, string> = {
    years: 'Рік',
    score: 'Оцінка',
};

const BOOLEAN_PARAMS: Record<string, string> = {
    only_translated: 'Перекладено українською',
};

const COMBINED_PARAMS: Record<string, { label: string; related: string[] }> = {
    date_range_enabled: {
        label: 'Часовий проміжок',
        related: ['date_range'],
    },
};

const TRISTATE_PARAMS = new Set(['genres']);

export interface ActiveFilter {
    param: string;
    value: string;
    label: string;
    excluded?: boolean;
}

/**
 * Reads URL search params + dynamic label maps and returns a list of
 * human-readable active filter objects, their count, and a clearAll action.
 * Used by both the ActiveFilters chip component and any badge/count display.
 */
export function useActiveFilters() {
    const router = useRouter();
    const search = useRouterState({
        select: (s) =>
            (s.resolvedLocation ?? s.location).search as Record<
                string,
                unknown
            >,
    });

    const { data: genreMap } = useGenres({
        options: {
            select: (data) => {
                const map: Record<string, string> = {};
                data.list.forEach((genre) => {
                    map[genre.slug] =
                        genre.name_ua || genre.name_en || genre.slug;
                });
                return map;
            },
        },
    });

    const { list: studioList } = useSearchCompanies({
        args: { type: CompanyTypeEnum.STUDIO },
    });

    const studioMap = useMemo(() => {
        const map: Record<string, string> = {};
        studioList?.forEach((studio) => {
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

    const resolveLabel = (key: string, rawValue: string): string => {
        const value =
            TRISTATE_PARAMS.has(key) && rawValue.startsWith('-')
                ? rawValue.substring(1)
                : rawValue;

        if (dynamicLabelMaps[key]?.[value]) {
            return dynamicLabelMaps[key]![value];
        }

        if (STATIC_LABEL_MAPS[key]?.[value]) {
            return STATIC_LABEL_MAPS[key][value].title_ua;
        }

        return value;
    };

    const filters = useMemo(() => {
        const result: ActiveFilter[] = [];
        const processedRanges = new Set<string>();

        Object.entries(search).forEach(([key, rawValue]) => {
            if (IGNORED_PARAMS.has(key) || SUBORDINATE_PARAMS.has(key)) return;

            if (key in COMBINED_PARAMS) {
                if (rawValue === true || rawValue === 'true') {
                    result.push({
                        param: key,
                        value: 'true',
                        label: COMBINED_PARAMS[key].label,
                    });
                }
                return;
            }

            if (key in RANGE_PARAMS) {
                if (processedRanges.has(key)) return;
                processedRanges.add(key);

                const values = Array.isArray(rawValue)
                    ? rawValue.map(String)
                    : [String(rawValue)];
                if (values.length === 2) {
                    result.push({
                        param: key,
                        value: values.join(','),
                        label: `${RANGE_PARAMS[key]}: ${values[0]}–${values[1]}`,
                    });
                }
                return;
            }

            if (key in BOOLEAN_PARAMS) {
                result.push({
                    param: key,
                    value: String(rawValue),
                    label: BOOLEAN_PARAMS[key],
                });
                return;
            }

            if (Array.isArray(rawValue)) {
                rawValue.forEach((v) => {
                    const value = String(v);
                    const excluded =
                        TRISTATE_PARAMS.has(key) && value.startsWith('-');
                    result.push({
                        param: key,
                        value,
                        label: resolveLabel(key, value),
                        excluded,
                    });
                });
                return;
            }

            const value = String(rawValue);
            const excluded = TRISTATE_PARAMS.has(key) && value.startsWith('-');

            result.push({
                param: key,
                value,
                label: resolveLabel(key, value),
                excluded,
            });
        });

        return result;
    }, [search, dynamicLabelMaps]);

    const removeFilter = (filter: ActiveFilter) => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next: Record<string, unknown> = { ...prev };

                if (filter.param in COMBINED_PARAMS) {
                    delete next[filter.param];
                    COMBINED_PARAMS[filter.param].related.forEach(
                        (p) => delete next[p],
                    );
                } else if (filter.param in RANGE_PARAMS) {
                    delete next[filter.param];
                } else if (filter.param in BOOLEAN_PARAMS) {
                    delete next[filter.param];
                } else {
                    const current = next[filter.param];
                    if (Array.isArray(current)) {
                        const filtered = current.filter(
                            (v) => String(v) !== filter.value,
                        );
                        if (filtered.length > 0) {
                            next[filter.param] = filtered;
                        } else {
                            delete next[filter.param];
                        }
                    } else {
                        delete next[filter.param];
                    }
                }

                delete next.page;
                return next;
            },
            replace: true,
        } as any);
    };

    const clearAll = () => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next: Record<string, unknown> = {};
                if (prev.search) next.search = prev.search;
                if (prev.sort) next.sort = prev.sort;
                if (prev.order) next.order = prev.order;
                return next;
            },
            replace: true,
        } as any);
    };

    return { filters, count: filters.length, removeFilter, clearAll };
}

interface Props {
    className?: string;
}

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
                const isTriState = TRISTATE_PARAMS.has(filter.param);
                const variant = isTriState
                    ? filter.excluded
                        ? 'destructive'
                        : 'success'
                    : 'secondary';

                return (
                    <Badge
                        key={`${filter.param}-${filter.value}-${idx}`}
                        variant={variant}
                        className="group h-7 gap-1.5 pr-1.5 pl-2.5"
                    >
                        <span className="truncate">{filter.label}</span>
                        <button
                            type="button"
                            aria-label={`Видалити фільтр ${filter.label}`}
                            className="hover:bg-foreground/10 -mr-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full transition"
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
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-7 px-2"
                    onClick={clearAll}
                >
                    Очистити все
                </Button>
            )}
        </div>
    );
};

export default ActiveFilters;
