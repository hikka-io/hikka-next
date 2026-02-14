'use client';

import { CompanyTypeEnum } from '@hikka/client';
import { useGenres, useSearchCompanies } from '@hikka/react';
import { XIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';

import {
    SORT_ARTICLELIST,
    SORT_CONTENT,
    SORT_EDITLIST,
    SORT_READLIST,
    SORT_WATCHLIST,
} from '@/features/filters/components/prebuilt/sort';

import { cn } from '@/utils/cn';
import {
    AGE_RATING,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from '@/utils/constants/common';

const SORT_LABELS: Record<string, string> = Object.fromEntries(
    [
        ...SORT_CONTENT,
        ...SORT_WATCHLIST,
        ...SORT_READLIST,
        ...SORT_EDITLIST,
        ...SORT_ARTICLELIST,
    ].map(({ value, label }) => [value, label]),
);

const STATIC_LABEL_MAPS: Record<
    string,
    Record<string, { title_ua: string }>
> = {
    statuses: RELEASE_STATUS,
    seasons: SEASON,
    types: MEDIA_TYPE,
    ratings: AGE_RATING,
};

const IGNORED_PARAMS = new Set(['page', 'search', 'order']);

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

interface ActiveFilter {
    param: string;
    value: string;
    label: string;
    excluded?: boolean;
}

interface Props {
    className?: string;
}

const ActiveFilters: FC<Props> = ({ className }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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

        if (key === 'sort' && SORT_LABELS[value]) {
            return SORT_LABELS[value];
        }

        return value;
    };

    const activeFilters = useMemo(() => {
        const filters: ActiveFilter[] = [];
        const processedRanges = new Set<string>();

        searchParams.forEach((value, key) => {
            if (IGNORED_PARAMS.has(key) || SUBORDINATE_PARAMS.has(key)) return;

            if (key in COMBINED_PARAMS) {
                if (value === 'true') {
                    filters.push({
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

                const values = searchParams.getAll(key);
                if (values.length === 2) {
                    filters.push({
                        param: key,
                        value: values.join(','),
                        label: `${RANGE_PARAMS[key]}: ${values[0]}–${values[1]}`,
                    });
                }
                return;
            }

            if (key in BOOLEAN_PARAMS) {
                filters.push({
                    param: key,
                    value,
                    label: BOOLEAN_PARAMS[key],
                });
                return;
            }

            const excluded = TRISTATE_PARAMS.has(key) && value.startsWith('-');

            filters.push({
                param: key,
                value,
                label: resolveLabel(key, value),
                excluded,
            });
        });

        return filters;
    }, [searchParams, dynamicLabelMaps]);

    const handleRemove = (filter: ActiveFilter) => {
        const params = new URLSearchParams(searchParams.toString());

        if (filter.param in COMBINED_PARAMS) {
            params.delete(filter.param);
            COMBINED_PARAMS[filter.param].related.forEach((p) =>
                params.delete(p),
            );
        } else if (filter.param in RANGE_PARAMS) {
            params.delete(filter.param);
        } else if (filter.param in BOOLEAN_PARAMS) {
            params.delete(filter.param);
        } else {
            const values = params.getAll(filter.param);
            params.delete(filter.param);
            values
                .filter((v) => v !== filter.value)
                .forEach((v) => params.append(filter.param, v));
        }

        params.delete('page');

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    if (activeFilters.length === 0) return null;

    return (
        <div className={cn('flex flex-wrap items-center gap-2', className)}>
            {activeFilters.map((filter, idx) => {
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
                        className="gap-1"
                    >
                        {filter.label}
                        <button
                            type="button"
                            className="ml-1 inline-flex shrink-0"
                            onClick={() => handleRemove(filter)}
                        >
                            <XIcon className="size-3" />
                        </button>
                    </Badge>
                );
            })}
        </div>
    );
};

export default ActiveFilters;
