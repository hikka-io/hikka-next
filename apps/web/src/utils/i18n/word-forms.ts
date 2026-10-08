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
