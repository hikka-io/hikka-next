'use client';

import { CompanyTypeEnum } from '@hikka/client';
import { useGenres, useSearchCompanies } from '@hikka/react';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { XIcon } from 'lucide-react';
import { FC, ReactElement, SVGProps, useMemo } from 'react';

import { MaterialSymbolsStarRounded } from '@/components/icons/material-symbols/MaterialSymbolsStarRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { cn } from '@/utils/cn';
import {
    AGE_RATING,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants/common';

type FilterDef =
    | {
          kind: 'enum';
          labelMap: Record<string, { title_ua: string }>;
          tristate?: true;
      }
    | { kind: 'dynamic'; tristate?: true }
    | { kind: 'range'; icon?: (props: SVGProps<SVGSVGElement>) => ReactElement }
    | { kind: 'boolean'; label: string }
    | { kind: 'combined'; label: string; related: string[] }
    | { kind: 'subordinate' }
    | { kind: 'ignored' };

const FILTER_REGISTRY: Record<string, FilterDef> = {
    // Ignored params (not displayed as active filters)
    page: { kind: 'ignored' },
    search: { kind: 'ignored' },
    order: { kind: 'ignored' },
    sort: { kind: 'ignored' },

    // Subordinate params (controlled by a combined param)
    date_range: { kind: 'subordinate' },

    // Enum params with static label maps
    statuses: { kind: 'enum', labelMap: RELEASE_STATUS },
    seasons: { kind: 'enum', labelMap: SEASON },
    types: { kind: 'enum', labelMap: MEDIA_TYPE },
    ratings: { kind: 'enum', labelMap: AGE_RATING },

    // Enum params with dynamic label maps (fetched from API)
    genres: { kind: 'dynamic', tristate: true },
    studios: { kind: 'dynamic' },

    // Range params
    years: { kind: 'range' },
    score: { kind: 'range', icon: MaterialSymbolsStarRounded },

    // Boolean params
    only_translated: { kind: 'boolean', label: 'Перекладено українською' },

    // Combined params (group related URL params under one chip)
    date_range_enabled: {
        kind: 'combined',
        label: 'Часовий проміжок',
        related: ['date_range'],
    },
};

export interface ActiveFilter {
    param: string;
    value: string;
    label: string;
    icon?: (props: SVGProps<SVGSVGElement>) => ReactElement;
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

    const hasGenres = 'genres' in search;
    const hasStudios = 'studios' in search;

    const { data: genreMap } = useGenres({
        options: {
            enabled: hasGenres,
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
        options: { enabled: hasStudios },
    });

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

    const filters = useMemo(() => {
        const resolveLabel = (key: string, rawValue: string): string => {
            const def = FILTER_REGISTRY[key];
            const isTristate = def && 'tristate' in def && def.tristate;
            const value =
                isTristate && rawValue.startsWith('-')
                    ? rawValue.substring(1)
                    : rawValue;

            if (def?.kind === 'enum' && def.labelMap[value]) {
                return def.labelMap[value].title_ua;
            }

            if (def?.kind === 'dynamic' && dynamicLabelMaps[key]?.[value]) {
                return dynamicLabelMaps[key]![value];
            }

            return value;
        };

        const result: ActiveFilter[] = [];

        Object.entries(search).forEach(([key, rawValue]) => {
            const def = FILTER_REGISTRY[key];

            if (!def || def.kind === 'ignored' || def.kind === 'subordinate') return;

            switch (def.kind) {
                case 'combined': {
                    if (rawValue === true || rawValue === 'true') {
                        result.push({
                            param: key,
                            value: 'true',
                            label: def.label,
                        });
                    }
                    return;
                }

                case 'range': {
                    const values = Array.isArray(rawValue)
                        ? rawValue.map(String)
                        : [String(rawValue)];

                    if (values.length === 2) {
                        result.push({
                            param: key,
                            value: values.join(','),
                            label: `${values[0]}–${values[1]}`,
                            icon: def.icon,
                        });
                    }
                    return;
                }

                case 'boolean': {
                    result.push({
                        param: key,
                        value: String(rawValue),
                        label: def.label,
                    });
                    return;
                }

                case 'enum':
                case 'dynamic': {
                    const isTristate = 'tristate' in def && def.tristate;
                    const addValue = (v: unknown) => {
                        const value = String(v);
                        const excluded = isTristate && value.startsWith('-');
                        result.push({
                            param: key,
                            value,
                            label: resolveLabel(key, value),
                            excluded,
                        });
                    };

                    if (Array.isArray(rawValue)) {
                        rawValue.forEach(addValue);
                    } else {
                        addValue(rawValue);
                    }
                    return;
                }
            }
        });

        return result;
    }, [search, dynamicLabelMaps]);

    const removeFilter = (filter: ActiveFilter) => {
        const def = FILTER_REGISTRY[filter.param];

        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next: Record<string, unknown> = { ...prev };

                switch (def?.kind) {
                    case 'combined':
                        delete next[filter.param];
                        def.related.forEach((p) => delete next[p]);
                        break;

                    // Range and boolean always map to a single chip — delete the whole param
                    case 'range':
                    case 'boolean':
                        delete next[filter.param];
                        break;

                    case 'enum':
                    case 'dynamic': {
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
                        break;
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
                const def = FILTER_REGISTRY[filter.param];
                const isTriState =
                    def && 'tristate' in def && def.tristate;
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
                        {filter.icon && (
                            <filter.icon className="size-3 shrink-0" />
                        )}
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
