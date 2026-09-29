import type { ContentTypeEnum } from '@hikka/api';

export type FilterPreset = {
    id: string;
    name: string;
    description?: string;
    content_types: ContentTypeEnum[];
    statuses?: string[];
    seasons?: string[];
    types?: string[];
    genres?: string[];
    only_translated?: boolean;
    sort?: string;
    order?: string;
    ratings?: string[];
    studios?: string[];
    years?: number[];
    score?: number[];
    date_range_enabled?: boolean;
    date_range?: number[] | null;
};
