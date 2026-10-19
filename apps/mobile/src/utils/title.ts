const TITLE_PRIORITY = ['title_ua', 'title_en', 'title_ja'] as const;

export function getTitle(item: Partial<Record<string, unknown>>): string {
    for (const key of TITLE_PRIORITY) {
        const value = item[key];
        if (typeof value === 'string' && value) return value;
    }
    return '';
}
