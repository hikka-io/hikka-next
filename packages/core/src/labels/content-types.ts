import { CollectionContentTypeEnum, ContentTypeEnum } from '@hikka/api';

import type { FilterProperty } from './enum-labels';

type ContentTypeForms = {
    plural?: string;
    genitive?: string;
    accusative?: string;
};

export const CONTENT_TYPES = {
    [ContentTypeEnum.ANIME]: {
        title_ua: 'Аніме',
        plural: 'Аніме',
        genitive: 'аніме',
        accusative: 'аніме',
    },
    [ContentTypeEnum.CHARACTER]: {
        title_ua: 'Персонаж',
        plural: 'Персонажі',
    },
    [ContentTypeEnum.PERSON]: {
        title_ua: 'Людина',
        plural: 'Люди',
    },
    [ContentTypeEnum.EDIT]: {
        title_ua: 'Правка',
    },
    [ContentTypeEnum.COMMENT]: {
        title_ua: 'Коментар',
    },
    [ContentTypeEnum.COLLECTION]: {
        title_ua: 'Колекція',
        plural: 'Колекції',
    },
    [ContentTypeEnum.MANGA]: {
        title_ua: 'Манґа',
        plural: 'Манґа',
        genitive: 'манґи',
        accusative: 'манґу',
    },
    [ContentTypeEnum.NOVEL]: {
        title_ua: 'Ранобе',
        plural: 'Ранобе',
        genitive: 'ранобе',
        accusative: 'ранобе',
    },
    [ContentTypeEnum.USER]: {
        title_ua: 'Користувач',
    },
    [ContentTypeEnum.ARTICLE]: {
        title_ua: 'Стаття',
    },
    [ContentTypeEnum.HISTORY]: {
        title_ua: 'Активність',
    },
} satisfies FilterProperty<ContentTypeEnum | 'user', ContentTypeForms>;

export const COLLECTION_CONTENT_TYPE_OPTIONS = [
    {
        value: CollectionContentTypeEnum.ANIME,
        label: 'Аніме',
    },
    {
        value: CollectionContentTypeEnum.MANGA,
        label: 'Манґа',
    },
    {
        value: CollectionContentTypeEnum.NOVEL,
        label: 'Ранобе',
    },
    {
        value: CollectionContentTypeEnum.CHARACTER,
        label: 'Персонаж',
    },
    {
        value: CollectionContentTypeEnum.PERSON,
        label: 'Людина',
    },
] satisfies { value: CollectionContentTypeEnum; label: string }[];
