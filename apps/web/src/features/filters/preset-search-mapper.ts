import type { ContentTypeEnum } from '@hikka/api';

import type { FilterPreset } from './presets/types';

type Search = Record<string, unknown>;

const STRING_LIST_KEYS = [
    'statuses',
    'seasons',
    'types',
    'genres',
    'ratings',
    'studios',
] as const;
const NUMBER_LIST_KEYS = ['years', 'score', 'date_range'] as const;
const FLAG_KEYS = ['only_translated', 'date_range_enabled'] as const;
const TEXT_KEYS = ['sort', 'order'] as const;

const SEARCH_KEYS = [
    ...STRING_LIST_KEYS,
    ...NUMBER_LIST_KEYS,
    ...FLAG_KEYS,
    ...TEXT_KEYS,
] as const;

const toList = (value: unknown): unknown[] =>
    value == null ? [] : Array.isArray(value) ? value : [value];

export const presetFromSearch = (
    search: Search,
    contentType?: ContentTypeEnum,
): Partial<FilterPreset> => {
    const preset: Search = { name: '', description: '' };

    for (const key of ['content_types', ...STRING_LIST_KEYS]) {
        const values = toList(search[key]).map(String);
        if (values.length > 0) preset[key] = values;
    }

    for (const key of NUMBER_LIST_KEYS) {
        const values = toList(search[key]).map(Number);
        if (values.length > 0) preset[key] = values;
    }

    for (const key of FLAG_KEYS) {
        const value = search[key];
        if (value != null) preset[key] = value === true || value === 'true';
    }

    for (const key of TEXT_KEYS) {
        const value = search[key];
        if (value != null && value !== '') preset[key] = String(value);
    }

    if (!preset.content_types && contentType) {
        preset.content_types = [contentType];
    }

    return preset as Partial<FilterPreset>;
};

export const presetToSearch = (preset: FilterPreset): Search => {
    const search: Search = {};

    for (const key of SEARCH_KEYS) {
        const value = preset[key];
        if (value != null) search[key] = value;
    }

    return search;
};
