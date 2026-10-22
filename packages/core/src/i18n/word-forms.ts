import type { ContentTypeEnum } from '@hikka/api';

import type { WordForms } from './declension';

export const EPISODE_FORMS = [
    'епізод',
    'епізоди',
    'епізодів',
] as const satisfies WordForms;

export const CHAPTER_FORMS = [
    'розділ',
    'розділи',
    'розділів',
] as const satisfies WordForms;

export const VOLUME_FORMS = [
    'том',
    'томи',
    'томів',
] as const satisfies WordForms;

export const LINK_FORMS = [
    'посилання',
    'посилання',
    'посилань',
] as const satisfies WordForms;

export const TIMES_FORMS = [
    'раз',
    'рази',
    'разів',
] as const satisfies WordForms;

export const COMMENT_FORMS = [
    'коментар',
    'коментарі',
    'коментарів',
] as const satisfies WordForms;

export const REPLY_FORMS = [
    'відповідь',
    'відповіді',
    'відповідей',
] as const satisfies WordForms;

export const MONTH_FORMS = [
    'місяць',
    'місяці',
    'місяців',
] as const satisfies WordForms;

export const DAY_FORMS = ['день', 'дні', 'днів'] as const satisfies WordForms;

export const HOUR_FORMS = [
    'година',
    'години',
    'годин',
] as const satisfies WordForms;

export const SYMBOL_FORMS = [
    'символ',
    'символи',
    'символів',
] as const satisfies WordForms;

export const VIEW_FORMS = [
    'перегляд',
    'перегляди',
    'переглядів',
] as const satisfies WordForms;

export const REREAD_FORMS = [
    'перечитування',
    'перечитування',
    'перечитувань',
] as const satisfies WordForms;

export const TITLE_FORMS = [
    'тайтл',
    'тайтли',
    'тайтлів',
] as const satisfies WordForms;

export const ANIME_FORMS = [
    'аніме',
    'аніме',
    'аніме',
] as const satisfies WordForms;

export const MANGA_FORMS = [
    'манґа',
    'манґи',
    'манґ',
] as const satisfies WordForms;

export const NOVEL_FORMS = [
    'ранобе',
    'ранобе',
    'ранобе',
] as const satisfies WordForms;

export const CHARACTER_FORMS = [
    'персонаж',
    'персонажі',
    'персонажів',
] as const satisfies WordForms;

export const PERSON_FORMS = [
    'людина',
    'людини',
    'людей',
] as const satisfies WordForms;

export const COLLECTION_FORMS = [
    'колекція',
    'колекції',
    'колекцій',
] as const satisfies WordForms;

export const RELATION_FORMS = [
    'зв’язок',
    'зв’язки',
    'зв’язків',
] as const satisfies WordForms;

export const TAG_FORMS = ['тег', 'теги', 'тегів'] as const satisfies WordForms;

export const WORD_FORMS = [
    'слово',
    'слова',
    'слів',
] as const satisfies WordForms;

/** The noun a count of each kind of content takes, e.g. "205 манґ". */
export const CONTENT_COUNT_FORMS = {
    anime: ANIME_FORMS,
    manga: MANGA_FORMS,
    novel: NOVEL_FORMS,
    character: CHARACTER_FORMS,
    person: PERSON_FORMS,
    collection: COLLECTION_FORMS,
} as const satisfies Partial<Record<ContentTypeEnum, WordForms>>;
