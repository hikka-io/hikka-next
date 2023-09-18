export {};

declare global {
    interface Window {
        authModal: HTMLDialogElement;
    }

    namespace Hikka {
        type WatchStatus = 'completed'
            | 'watching'
            | 'planned'
            | 'dropped'
            | 'on_hold';

        type StatType =
            | WatchStatus
            | 'score_1'
            | 'score_2'
            | 'score_3'
            | 'score_4'
            | 'score_5'
            | 'score_6'
            | 'score_7'
            | 'score_8'
            | 'score_9'
            | 'score_10';

        type Stats = Record<StatType, number>;

        type Pagination = {
            total: number;
            pages: number;
            page: number;
        };

        type Season = 'summer' | 'winter' | 'fall' | 'spring';

        type MediaType = 'tv' | 'movie' | 'ova' | 'ona' | 'special';

        type AgeRating = 'g' | 'pg' | 'pg_13' | 'r' | 'r_plus' | 'rx';

        type Status =
            | 'ongoing'
            | 'finished'
            | 'discontinued'
            | 'announced'
            | 'paused';

        type VideoType = 'video_promo' | 'video_music';

        type OSTType = 'opening' | 'ending';

        type Video = {
            url: string;
            title: string;
            description: string;
            video_type: VideoType;
        };

        type OST = {
            index: number;
            title: string;
            author: string;
            spotify: string;
            ost_type: OSTType;
        };

        type Source =
            | 'digital_manga'
            | 'picture_book'
            | 'visual_novel'
            | '4_koma_manga'
            | 'light_novel'
            | 'card_game'
            | 'web_manga'
            | 'original'
            | 'manga'
            | 'music'
            | 'novel'
            | 'other'
            | 'radio'
            | 'game'
            | 'book';

        type Company = {
            company: {
                image: string;
                slug: string;
                name: string;
            };
            type: 'producer' | 'studio';
        };

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

        type Character = {
            name_ua: string;
            name_en: string;
            name_ja: string;
            image: string;
            slug: string;
        };

        type Person = {
            name_native: string;
            name_ua: string;
            name_en: string;
            image: string;
            slug: string;
        };
    }
}
