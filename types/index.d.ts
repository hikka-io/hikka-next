export {};

declare global {
    namespace Hikka {
        type Pagination = {
            total: number;
            pages: number;
            page: number;
        };

        type User = {
            username: string;
            avatar: string;
        };

        type Season = 'summer' | 'winter' | 'fall' | 'spring';

        type Release = 'tv' | 'movie' | 'ova' | 'ona' | 'music' | 'special';

        type AgeRating = 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

        type Status = 'airing' | 'finished' | 'not_yet';

        type Anime = {
            media_type: string;
            title_ua: string;
            title_en: string;
            title_ja: string;
            episodes_released: number;
            episodes_total: number;
            poster: string;
            status: string;
            scored_by: number;
            score: number;
            slug: string;
        };

        type Genre = {
            name_en: string;
            name_ua: string;
            slug: string;
            type: string;
        };
    }
}
