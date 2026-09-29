import { ContentTypeEnum } from '@hikka/api';

type ContentTypeForms = {
    plural?: string;
    genitive?: string;
    accusative?: string;
};

export const CONTENT_TYPES = {
    [ContentTypeEnum.ANIME]: {
        title_ua: 'Аніме',
        title_en: 'Anime',
        plural: 'Аніме',
        genitive: 'аніме',
        accusative: 'аніме',
    },
    [ContentTypeEnum.CHARACTER]: {
        title_ua: 'Персонаж',
        title_en: 'Character',
        plural: 'Персонажі',
    },
    [ContentTypeEnum.PERSON]: {
        title_ua: 'Автор',
        title_en: 'Person',
        plural: 'Люди',
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
        plural: 'Колекції',
    },
    [ContentTypeEnum.MANGA]: {
        title_ua: 'Манґа',
        title_en: 'Manga',
        plural: 'Манґа',
        genitive: 'манґи',
        accusative: 'манґу',
    },
    [ContentTypeEnum.NOVEL]: {
        title_ua: 'Ранобе',
        title_en: 'Ranobe',
        plural: 'Ранобе',
        genitive: 'ранобе',
        accusative: 'ранобе',
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
} satisfies Hikka.FilterProperty<ContentTypeEnum | 'user', ContentTypeForms>;

export const COLLECTION_CONTENT_TYPE_OPTIONS = [
    {
        value: 'anime',
        label: 'Аніме',
    },
    {
        value: 'manga',
        label: 'Манґа',
    },
    {
        value: 'novel',
        label: 'Ранобе',
    },
    {
        value: 'character',
        label: 'Персонаж',
    },
    {
        value: 'person',
        label: 'Людина',
    },
];
