export type TitleLanguage =
    | 'title_original'
    | 'title_ua'
    | 'title_en'
    | 'title_ja';
export type NameLanguage = 'name_native' | 'name_ua' | 'name_en' | 'name_ja';

const TITLE_PRIORITY: TitleLanguage[] = [
    'title_ua',
    'title_en',
    'title_original',
    'title_ja',
];
const NAME_PRIORITY: NameLanguage[] = [
    'name_ua',
    'name_en',
    'name_native',
    'name_ja',
];

export function getTitle(
    item: Record<string, unknown> | object | null | undefined,
    titleLang: TitleLanguage = 'title_ua',
    nameLang: NameLanguage = 'name_ua',
): string {
    if (!item) return '';
    const record = item as Record<string, unknown>;
    const titles: TitleLanguage[] = [
        titleLang,
        ...TITLE_PRIORITY.filter((k) => k !== titleLang),
    ];
    for (const key of titles) {
        if (record[key] && typeof record[key] === 'string')
            return record[key] as string;
    }
    const names: NameLanguage[] = [
        nameLang,
        ...NAME_PRIORITY.filter((k) => k !== nameLang),
    ];
    for (const key of names) {
        const value = record[key];
        if (value && typeof value === 'string') return value as string;
        if (key === 'name_native' && !value) {
            const ja = record.name_ja;
            if (ja && typeof ja === 'string') return ja;
        }
        if (key === 'name_ja' && !value) {
            const n = record.name_native;
            if (n && typeof n === 'string') return n;
        }
    }
    return '';
}
