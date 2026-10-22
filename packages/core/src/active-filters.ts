import {
    AGE_RATING,
    ARTICLE_CATEGORY,
    CHARACTER_ISSUES,
    CONTENT_ISSUES,
    CONTENT_TYPES,
    EDIT_STATUS,
    MEDIA_TYPE,
    RELEASE_STATUS,
    SEASON,
} from './labels';

type FilterDef =
    | {
          kind: 'enum';
          labelMap: Record<string, { title_ua: string }>;
          tristate?: true;
      }
    | { kind: 'dynamic'; tristate?: true }
    | { kind: 'range' }
    /** `viewerOnly` flags apply only with a session, so a logged-out visitor gets no chip. */
    | { kind: 'boolean'; label: string; viewerOnly?: true }
    /** Free-form param whose own value belongs on the chip, e.g. `MAL ID: 47128`. */
    | { kind: 'value'; label: string }
    | { kind: 'combined'; label: string; related: string[] }
    | { kind: 'subordinate' }
    | { kind: 'ignored' };

const FILTER_REGISTRY: Record<string, FilterDef> = {
    // Ignored params (not displayed as active filters)
    page: { kind: 'ignored' },
    search: { kind: 'ignored' },
    order: { kind: 'ignored' },
    sort: { kind: 'ignored' },
    // Selects which list is shown rather than filtering it.
    tab: { kind: 'ignored' },

    // Subordinate params (controlled by a combined param)
    date_range: { kind: 'subordinate' },

    // Enum params with static label maps
    statuses: { kind: 'enum', labelMap: RELEASE_STATUS },
    seasons: { kind: 'enum', labelMap: SEASON },
    types: { kind: 'enum', labelMap: MEDIA_TYPE },
    ratings: { kind: 'enum', labelMap: AGE_RATING },
    content_type: { kind: 'enum', labelMap: CONTENT_TYPES },
    categories: { kind: 'enum', labelMap: ARTICLE_CATEGORY },
    edit_status: { kind: 'enum', labelMap: EDIT_STATUS },

    // Enum params with dynamic label maps (fetched from API)
    genres: { kind: 'dynamic', tristate: true },
    studios: { kind: 'dynamic' },
    // No magazine lookup endpoint, so chips show the raw slug.
    magazines: { kind: 'dynamic' },
    // Free-text tags of articles and collections; the chip shows the tag itself.
    tags: { kind: 'dynamic' },

    // Range params
    years: { kind: 'range' },
    score: { kind: 'range' },

    // Boolean params
    only_translated: { kind: 'boolean', label: 'Перекладено українською' },
    hide_listed: {
        kind: 'boolean',
        label: 'Без тайтлів з мого списку',
        viewerOnly: true,
    },
    draft: { kind: 'boolean', label: 'Чернетки', viewerOnly: true },

    // Missing-data flags of the /edit/content lists
    issues: {
        kind: 'enum',
        tristate: true,
        labelMap: { ...CONTENT_ISSUES, ...CHARACTER_ISSUES },
    },

    // Value params (the chip carries the entered value)
    mal_id: { kind: 'value', label: 'MAL ID' },
    content_slug: { kind: 'value', label: 'Slug' },
    author: { kind: 'value', label: 'Автор' },
    moderator: { kind: 'value', label: 'Модератор' },

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
    excluded?: boolean;
}

type ActiveFilterOptions = {
    /** Names for `dynamic` params (genres, studios) by slug. */
    labelMaps?: Record<string, Record<string, string> | undefined>;
    /** Whether a session exists; `viewerOnly` booleans need one. */
    signedIn?: boolean;
};

/** Include/exclude params (`-slug` excludes), styled green/red. */
export function isTristateFilter(param: string): boolean {
    const def = FILTER_REGISTRY[param];

    return Boolean(def && 'tristate' in def && def.tristate);
}

/** Human-readable chips for the active filters of a search, in param order. */
export function getActiveFilters(
    search: Record<string, unknown>,
    { labelMaps = {}, signedIn = false }: ActiveFilterOptions = {},
): ActiveFilter[] {
    const resolveLabel = (key: string, rawValue: string): string => {
        const def = FILTER_REGISTRY[key];
        const value =
            isTristateFilter(key) && rawValue.startsWith('-')
                ? rawValue.substring(1)
                : rawValue;

        if (def?.kind === 'enum' && def.labelMap[value]) {
            return def.labelMap[value].title_ua;
        }

        const dynamicLabel = labelMaps[key]?.[value];

        if (def?.kind === 'dynamic' && dynamicLabel) {
            return dynamicLabel;
        }

        return value;
    };

    const result: ActiveFilter[] = [];

    Object.entries(search).forEach(([key, rawValue]) => {
        const def = FILTER_REGISTRY[key];

        if (!def || def.kind === 'ignored' || def.kind === 'subordinate')
            return;

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
                    });
                }
                return;
            }

            case 'boolean': {
                if (def.viewerOnly && !signedIn) return;

                result.push({
                    param: key,
                    value: String(rawValue),
                    label: def.label,
                });
                return;
            }

            case 'value': {
                result.push({
                    param: key,
                    value: String(rawValue),
                    label: `${def.label}: ${rawValue}`,
                });
                return;
            }

            case 'enum':
            case 'dynamic': {
                const tristate = isTristateFilter(key);
                const addValue = (v: unknown) => {
                    const value = String(v);
                    const excluded = tristate && value.startsWith('-');
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
}

/** The search without one chip's value (or param), and without `page`. */
export function removeActiveFilter<T extends Record<string, unknown>>(
    search: T,
    filter: ActiveFilter,
): T {
    const def = FILTER_REGISTRY[filter.param];
    const next: Record<string, unknown> = { ...search };

    switch (def?.kind) {
        case 'combined':
            delete next[filter.param];
            def.related.forEach((p) => {
                delete next[p];
            });
            break;

        // Range, boolean and value always map to a single chip — delete the whole param
        case 'range':
        case 'boolean':
        case 'value':
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
    return next as T;
}
