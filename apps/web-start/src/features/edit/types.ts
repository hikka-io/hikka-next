import type {
    AnimeResponse,
    CharacterResponse,
    MangaResponse,
    NovelResponse,
    PersonResponse,
} from '@hikka/api';

/**
 * Local replacement for the old `the legacy client` `MainContent` union. The
 * generated `@hikka/api` does not emit a named alias for the editable-content
 * union, so we reconstruct it from the per-entity response types. Mirrors the
 * `content` member of the generated `EditResponse`.
 */
export type EditMainContent =
    | AnimeResponse
    | MangaResponse
    | NovelResponse
    | PersonResponse
    | CharacterResponse;
