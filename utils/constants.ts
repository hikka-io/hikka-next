type Property<T extends string> = Record<
    T,
    {
        title_ua: string;
        title_en: string;
    }
>;

export const CDN_ENDPOINT = 'https://cdn.hikka.io';

export const WATCH_STATUS = {
    planned: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
    },
    watching: {
        title_ua: 'Дивлюсь',
        title_en: 'Watching',
    },
    completed: {
        title_ua: 'Завершено',
        title_en: 'Completed',
    },
    on_hold: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
    },
    dropped: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
    },
};

export const SEASON: Property<Hikka.Season> = {
    winter: {
        title_ua: 'Зима',
        title_en: 'Winter',
    },
    spring: {
        title_ua: 'Весна',
        title_en: 'Spring',
    },
    summer: {
        title_ua: 'Літо',
        title_en: 'Summer',
    },
    fall: {
        title_ua: 'Осінь',
        title_en: 'Fall',
    },
};

export const RELEASE_STATUS: Property<Hikka.Status> = {
    discontinued: {
        title_ua: 'Припинено',
        title_en: 'Discontinued',
    },
    announced: {
        title_ua: 'Анонс',
        title_en: 'Announced',
    },
    finished: {
        title_ua: 'Завершено',
        title_en: 'Finished',
    },
    ongoing: {
        title_ua: 'Онгоінг',
        title_en: 'Ongoing',
    },
    paused: {
        title_ua: 'Зупинено',
        title_en: 'Paused',
    },
};

export const MEDIA_TYPE: Property<Hikka.MediaType> = {
    special: {
        title_ua: 'Спешл',
        title_en: 'Special',
    },
    movie: {
        title_ua: 'Фільм',
        title_en: 'Movie',
    },
    ova: {
        title_ua: 'OVA',
        title_en: 'OVA',
    },
    ona: {
        title_ua: 'ONA',
        title_en: 'ONA',
    },
    tv: {
        title_ua: 'TV Серіал',
        title_en: 'TV',
    },
};

export const AGE_RATING: Property<Hikka.AgeRating> = {
    r_plus: {
        title_ua: 'R PLUS',
        title_en: 'R PLUS',
    },
    pg_13: {
        title_ua: 'PG-13',
        title_en: 'PG-13',
    },
    pg: {
        title_ua: 'PG',
        title_en: 'PG',
    },
    rx: {
        title_ua: 'RX',
        title_en: 'RX',
    },
    g: {
        title_ua: 'G',
        title_en: 'G',
    },
    r: {
        title_ua: 'R',
        title_en: 'R',
    },
};

export const VIDEO: Property<Hikka.Video> = {
    video_promo: {
        title_ua: 'Промо Відео',
        title_en: 'Promo Video',
    },
    video_music: {
        title_ua: 'Музичне Відео',
        title_en: 'Music Video',
    },
};

export const OST: Property<Hikka.OST> = {
    opening: {
        title_ua: 'Опенінг',
        title_en: 'Opening',
    },
    ending: {
        title_ua: 'Ендінг',
        title_en: 'Ending',
    },
};
