import { ContentTypeEnum } from '@hikka/api';

export const CONTENT_TYPES: Hikka.FilterProperty<ContentTypeEnum | 'user'> = {
    [ContentTypeEnum.ANIME]: {
        title_ua: 'Аніме',
        title_en: 'Anime',
    },
    [ContentTypeEnum.CHARACTER]: {
        title_ua: 'Персонаж',
        title_en: 'Character',
    },
    [ContentTypeEnum.PERSON]: {
        title_ua: 'Автор',
        title_en: 'Person',
    },
    [ContentTypeEnum.EDIT]: {
        title_ua: 'Правка',
        title_en: 'Edit',
    },
    [ContentTypeEnum.COMMENT]: {
        title_ua: 'Коментар',
        title_en: 'Comment',
    },
    [ContentTypeEnum.COLLECTION]: {
        title_ua: 'Колекція',
        title_en: 'Collection',
    },
    [ContentTypeEnum.MANGA]: {
        title_ua: 'Манґа',
        title_en: 'Manga',
    },
    [ContentTypeEnum.NOVEL]: {
        title_ua: 'Ранобе',
        title_en: 'Ranobe',
    },
    [ContentTypeEnum.USER]: {
        title_ua: 'Користувач',
        title_en: 'User',
    },
    [ContentTypeEnum.ARTICLE]: {
        title_ua: 'Стаття',
        title_en: 'Article',
    },
    [ContentTypeEnum.HISTORY]: {
        title_ua: 'Активність',
        title_en: 'History',
    },
};
