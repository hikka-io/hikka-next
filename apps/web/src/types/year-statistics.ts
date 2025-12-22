import { ContentTypeEnum } from '@hikka/client';

export interface YearTopContent {
    date: number;
    score: number;
    title_ja?: string;
    title_original?: string;
    title_en: string | null;
    title_ua: string | null;
    image: string;
    slug: string;
}

export interface YearGenre {
    name_ua: string;
    name_en: string;
    slug: string;
    count: number;
}

export interface YearBinge {
    start_date: number;
    end_date: number;
    count: number;
}

export interface YearStatusStats {
    completed: number;
    planned: number;
    dropped: number;
}

export interface YearScoreStats {
    min: number;
    max: number;
    avg: number;
}

export interface YearCompletedContent {
    title_ja?: string;
    title_original?: string;
    title_en: string | null;
    title_ua: string | null;
    image: string;
    slug: string;
    date: number;
}

export interface YearDurationMonth {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
}

export interface YearCompletedByMonth {
    january: YearCompletedContent[];
    february: YearCompletedContent[];
    march: YearCompletedContent[];
    april: YearCompletedContent[];
    may: YearCompletedContent[];
    june: YearCompletedContent[];
    july: YearCompletedContent[];
    august: YearCompletedContent[];
    september: YearCompletedContent[];
    october: YearCompletedContent[];
    november: YearCompletedContent[];
    december: YearCompletedContent[];
}

export type YearContentType =
    | ContentTypeEnum.ANIME
    | ContentTypeEnum.MANGA
    | ContentTypeEnum.NOVEL;

export interface YearStatistics {
    first_record: number;
    last_record: number;
    records_total: number;
    top: {
        anime: YearTopContent[];
        manga: YearTopContent[];
        novel: YearTopContent[];
    };
    genres: {
        anime: YearGenre[];
        manga: YearGenre[];
        novel: YearGenre[];
    };
    binges: YearBinge[];
    status: {
        anime: YearStatusStats;
        manga: YearStatusStats;
        novel: YearStatusStats;
    };
    score: {
        anime: YearScoreStats;
        manga: YearScoreStats;
        novel: YearScoreStats;
    };
    duration_total: number;
    duration_month: YearDurationMonth;
    completed: {
        anime: YearCompletedByMonth;
        manga: YearCompletedByMonth;
        novel: YearCompletedByMonth;
    };
}

export interface YearData {
    [username: string]: YearStatistics;
}
