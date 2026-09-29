import type {
    AnimeResponse,
    CharacterResponse,
    MangaResponse,
    NovelResponse,
    PersonResponse,
} from '@hikka/api';

/**
 * Editable main content union — `@hikka/api` emits no named alias for it, so we
 * reconstruct it. Mirrors the `content` member of the generated `EditResponse`.
 */
export type EditMainContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | PersonResponse
    | CharacterResponse;

export type EditParamType = 'input' | 'markdown' | 'list';

export type EditParam = {
    title: string;
    slug: string;
    placeholder?: string;
    type: EditParamType;
};

export type AnimeEditParams = {
    title_ua?: string;
    title_en?: string;
    title_ja?: string;
    synopsis_en?: string;
    synopsis_ua?: string;
    synonyms?: {
        value: string;
    }[];
};

export type MangaEditParams = {
    title_ua?: string;
    title_en?: string;
    title_original?: string;
    synopsis_en?: string;
    synopsis_ua?: string;
    synonyms?: {
        value: string;
    }[];
};

export type NovelEditParams = {
    title_ua?: string;
    title_en?: string;
    title_original?: string;
    synopsis_en?: string;
    synopsis_ua?: string;
    synonyms?: {
        value: string;
    }[];
};

export type CharacterEditParams = {
    name_ua: string;
    name_en: string;
    name_ja: string;
    description_ua: string;
};

export type PersonEditParams = {
    name_ua: string;
    name_en: string;
    name_native: string;
};
