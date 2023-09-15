export {};

declare global {
    declare namespace Hikka {
        type Filter<T> = {
            title: string;
            slug: T;
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
            reference: string;
            title_en: string;
            slug: string;
            title_jp: string;
            status: string;
            source: string;
            title: string;
            release: string;
            rating: string;
            image: string;
            episodes: number;
            year: number;
            scored_by: number;
            score: number;
            season: string;
            producers: string[];
            studios: string[];
            genres: string[];
        };
    }
}