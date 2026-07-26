import type {
    AnimeCatalogResponse,
    MangaCatalogResponse,
    NovelCatalogResponse,
} from '@hikka/api';

/**
 * Catalog list responses carry `genres`, `synopsis_*` and the `watch`/`read`
 * array on top of the base fields — everything the tooltip body and its
 * tracking control render. Cards pass the item through on those surfaces so the
 * tooltip skips its detail request; narrower payloads omit it and it fetches.
 */
export type MediaTooltipItem =
    | AnimeCatalogResponse
    | MangaCatalogResponse
    | NovelCatalogResponse;
