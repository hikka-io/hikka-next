import type { GenreResponse } from '@hikka/client';

export interface OgContentCardData {
    title: string;
    subtitle: string | null;
    image: string | null;
    score: number;
    mediaType: string | null;
    year: number | null;
    genres: string[];
    contentTypeLabel: string;
    producer: string | null;
}

export function resolveTitle(
    titleUa: string | null | undefined,
    titleEn: string | null | undefined,
    titleOriginal: string | null | undefined,
): { title: string; subtitle: string | null } {
    const title = titleUa || titleEn || titleOriginal || 'Без назви';
    let subtitle: string | null = null;

    if (titleUa && (titleOriginal || titleEn)) {
        subtitle = titleOriginal || titleEn || null;
    } else if (titleEn && titleOriginal) {
        subtitle = titleOriginal;
    }

    return { title, subtitle };
}

export function resolveGenres(
    genres: GenreResponse[],
    limit: number = 4,
): string[] {
    return genres
        .slice(0, limit)
        .map((g) => g.name_ua || g.name_en || g.slug)
        .filter(Boolean);
}

export function resolveMediaTypeLabel<T extends string>(
    mediaType: T,
    mediaTypeMap: Hikka.FilterProperty<T>,
): string | null {
    const entry = mediaTypeMap[mediaType];
    return entry ? entry.title_ua : null;
}
