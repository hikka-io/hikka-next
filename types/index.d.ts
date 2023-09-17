export {};

declare global {
    interface Window {
        authModal: HTMLDialogElement;
    }

    namespace Hikka {
        type Pagination = {
            total: number;
            pages: number;
            page: number;
        };

        type Season = 'summer' | 'winter' | 'fall' | 'spring';

        type MediaType = 'tv' | 'movie' | 'ova' | 'ona' | 'special';

        type AgeRating = 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

        type Status = 'ongoing' | 'finished' | 'discontinued' | 'announced' | 'paused';

        type Video = 'video_promo' | 'video_music';

        type OST = 'opening' | 'ending';

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
