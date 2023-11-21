import Completed from '@/app/_components/icons/watchStatus/Completed';
import Dropped from '@/app/_components/icons/watchStatus/Dropped';
import OnHold from '@/app/_components/icons/watchStatus/OnHold';
import Planned from '@/app/_components/icons/watchStatus/Planned';
import Watching from '@/app/_components/icons/watchStatus/Watching';
import { Property } from 'csstype';
import { ReactNode } from 'react';

type Property<T extends string> = Record<
    T,
    {
        title_ua: string;
        title_en: string;
        icon?: ReactNode;
        color?: string;
        description?: string;
    }
>;

export const CDN_ENDPOINT = 'https://cdn.hikka.io';

export const WATCH_STATUS = {
    planned: {
        title_ua: 'Заплановано',
        title_en: 'Planned',
        icon: Planned,
    },
    watching: {
        title_ua: 'Дивлюсь',
        title_en: 'Watching',
        icon: Watching,
    },
    completed: {
        title_ua: 'Завершено',
        title_en: 'Completed',
        icon: Completed,
    },
    on_hold: {
        title_ua: 'Відкладено',
        title_en: 'On Hold',
        icon: OnHold,
    },
    dropped: {
        title_ua: 'Закинуто',
        title_en: 'Dropped',
        icon: Dropped,
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
    /*discontinued: {
        title_ua: 'Припинено',
        title_en: 'Discontinued',
        color: '#952828'
    },*/
    announced: {
        title_ua: 'Анонс',
        title_en: 'Announced',
        color: '#AB872B',
    },
    finished: {
        title_ua: 'Завершено',
        title_en: 'Finished',
        color: '#518146',
    },
    ongoing: {
        title_ua: 'Онґоінґ',
        title_en: 'Ongoing',

        color: '#2B94AB',
    },
    /*paused: {
        title_ua: 'Зупинено',
        title_en: 'Paused',
        color: '#5C5C5C',
    },*/
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
    music: {
        title_ua: 'Музика',
        title_en: 'Music',
    },
};

export const AGE_RATING: Property<Hikka.AgeRating> = {

    g: {
        title_ua: 'G',
        title_en: 'G',
        description: "Немає вікових обмежень",
    },
    pg: {
        title_ua: 'PG',
        title_en: 'PG',
        description: "Рекомендується присутність батьків",
    },
    pg_13: {
        title_ua: 'PG-13',
        title_en: 'PG-13',
        description: "Дітям до 13 років перегляд небажаний",
    },
    r: {
        title_ua: 'R',
        title_en: 'R',
        description: "Особам до 18 років обовʼязкова присутність дорослого",
    },
    r_plus: {
        title_ua: 'R PLUS',
        title_en: 'R PLUS',
        description: "Особам до 18 років перегляд заборонений",
    },
    rx: {
        title_ua: 'RX',
        title_en: 'RX',
        description: "Хентай",
    },
};

export const VIDEO: Property<Hikka.VideoType> = {
    video_promo: {
        title_ua: 'Промо-відео',
        title_en: 'Promo Video',
    },
    video_music: {
        title_ua: 'Музичне Відео',
        title_en: 'Music Video',
    },
};

export const OST: Property<Hikka.OSTType> = {
    opening: {
        title_ua: 'Опенінг',
        title_en: 'Opening',
    },
    ending: {
        title_ua: 'Ендінг',
        title_en: 'Ending',
    },
};

export const SOURCE: Property<Hikka.Source> = {
    digital_manga: {
        title_ua: 'Цифрова Манга',
        title_en: 'Digital Manga',
    },
    picture_book: {
        title_ua: 'Книга з Ілюстраціями',
        title_en: 'Picture Book',
    },
    visual_novel: {
        title_ua: 'Візуальна Новала',
        title_en: 'Visual Novel',
    },
    '4_koma_manga': {
        title_ua: 'Чотирьохпанельна Манга',
        title_en: 'Yonkoma manga',
    },
    light_novel: {
        title_ua: 'Ранобе',
        title_en: 'Light Novel',
    },
    card_game: {
        title_ua: 'Карткова Гра',
        title_en: 'Card Game',
    },
    web_manga: {
        title_ua: 'Веб-манга',
        title_en: 'Web Manga',
    },
    original: {
        title_ua: 'Оригінальний Твір',
        title_en: 'Original',
    },
    manga: {
        title_ua: 'Манга',
        title_en: 'Manga',
    },
    music: {
        title_ua: 'Музика',
        title_en: 'Music',
    },
    novel: {
        title_ua: 'Новела',
        title_en: 'Novel',
    },
    other: {
        title_ua: 'Інше',
        title_en: 'Other',
    },
    radio: {
        title_ua: 'Радіо',
        title_en: 'Radio',
    },
    game: {
        title_ua: 'Гра',
        title_en: 'Game',
    },
    book: {
        title_ua: 'Книга',
        title_en: 'Book',
    },
};

export const EDIT_STATUS: Property<Hikka.EditStatus> = {
    pending: {
        title_ua: 'На Розгляді',
        title_en: 'Pending',
        color: '#AB872B',
    },
    accepted: {
        title_ua: 'Прийнято',
        title_en: 'Accepted',
        color: '#518146',
    },
    denied: {
        title_ua: 'Відхилено',
        title_en: 'Denied',
        color: '#952828',
    },
    closed: {
        title_ua: 'Закрито',
        title_en: 'Closed',
        color: '#5C5C5C',
    },
};
