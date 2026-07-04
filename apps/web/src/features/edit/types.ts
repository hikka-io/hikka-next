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
