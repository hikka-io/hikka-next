/**
 * Recovers a clean FastAPI route name from a default-generated operationId.
 *
 * FastAPI's default operationId is `re.sub(r'\W','_', name + path) + '_' + method`.
 * Since `name` is a valid identifier, the suffix `re.sub(r'\W','_', path) + '_' + method`
 * can be stripped to recover `name`. Idempotent on already-clean ids.
 */
export function recoverOperationId(
    operationId: string,
    path: string,
    method: string,
): string {
    const suffix = `${path.replace(/\W/g, '_')}_${method.toLowerCase()}`;
    return operationId.endsWith(suffix)
        ? operationId.slice(0, -suffix.length)
        : operationId;
}

/**
 * The backend types every `*Response.data_type` as a bare `string`, even though
 * each schema always carries one fixed content type (e.g. `AnimeResponse` →
 * `"anime"`). We narrow it to a literal at the spec level so the generated
 * types and the runtime zod response validators reflect reality. Values are
 * empirically verified against the live API. The map is keyed by exact schema
 * name; a single string becomes `const`, an array becomes an `enum`.
 */
const DATA_TYPE_BY_SCHEMA: Record<string, string | string[]> = {
    // anime
    AnimeResponse: 'anime',
    AnimeInfoResponse: 'anime',
    AnimeResponseWithSynopsis: 'anime',
    AnimeResponseWithWatch: 'anime',
    FavouriteAnimeResponse: 'anime',
    ArticleAnimeContentResponse: 'anime',
    // manga
    MangaResponse: 'manga',
    MangaInfoResponse: 'manga',
    MangaResponseWithRead: 'manga',
    FavouriteMangaResponse: 'manga',
    // novel
    NovelResponse: 'novel',
    NovelInfoResponse: 'novel',
    NovelResponseWithRead: 'novel',
    FavouriteNovelResponse: 'novel',
    // character
    CharacterResponse: 'character',
    CharacterCountResponse: 'character',
    FavouriteCharacterResponse: 'character',
    // person
    PersonResponse: 'person',
    PersonCountResponse: 'person',
    // collection
    CollectionResponse: 'collection',
    FavouriteCollectionResponse: 'collection',
    // comment
    CommentResponse: 'comment',
    CommentResponseFeed: 'comment',
    // article
    ArticleDocumentResponse: 'article',
    ArticlePreviewResponse: 'article',
    // article content reference: union of the two readable content types
    ArticleMangaNovelContentResponse: ['manga', 'novel'],
};

type SchemaProperty = { type?: string; const?: string; enum?: string[] };
type SchemaObject = {
    properties?: Record<string, SchemaProperty>;
};

type OpenApiSpec = {
    paths: Record<string, Record<string, { operationId?: string }>>;
    components?: { schemas?: Record<string, SchemaObject> };
};

/** Narrow `data_type` on every mapped schema to a const/enum literal. */
function narrowDataTypes(schemas: Record<string, SchemaObject>): void {
    for (const [name, schema] of Object.entries(schemas)) {
        const dataType = schema.properties?.data_type;
        if (!dataType) continue;

        const value = DATA_TYPE_BY_SCHEMA[name];
        if (value === undefined) {
            // A new *Response with a data_type we haven't mapped — surface it
            // on resync rather than silently leaving it as `string`.
            console.warn(
                `[transform-spec] unmapped data_type on schema "${name}" (left as string)`,
            );
            continue;
        }

        schema.properties!.data_type = Array.isArray(value)
            ? { type: 'string', enum: value }
            : { type: 'string', const: value };
    }
}

/**
 * Rewrites every operationId to its clean route name and narrows `data_type`
 * literals. Mutates and returns `spec`.
 */
export function transformSpec<T extends OpenApiSpec>(spec: T): T {
    for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, op] of Object.entries(methods)) {
            if (op && typeof op === 'object' && op.operationId) {
                op.operationId = recoverOperationId(
                    op.operationId,
                    path,
                    method,
                );
            }
        }
    }

    if (spec.components?.schemas) {
        narrowDataTypes(spec.components.schemas);
    }

    return spec;
}
