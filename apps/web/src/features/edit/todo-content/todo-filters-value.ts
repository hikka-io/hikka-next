export type TodoFiltersValue = {
    issues?: string[];
    types?: string[];
    mal_id?: number;
    genres?: string[];
    studios?: string[];
    magazines?: string[];
    seasons?: string[];
    statuses?: string[];
    ratings?: string[];
    years?: [number | null, number | null];
    content_type?: 'anime' | 'manga' | 'novel';
    content_slug?: string;
};
