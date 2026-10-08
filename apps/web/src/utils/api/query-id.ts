type ApiExport = keyof typeof import('@hikka/api');

// Generated `xxxQueryKey` builders set `_id: 'xxx'`; infinite builders reuse the base id.
export type QueryId = {
    [K in ApiExport]: K extends `${string}InfiniteQueryKey`
        ? never
        : K extends `${infer Id}QueryKey`
          ? Id
          : never;
}[ApiExport];

/** Read the generated query key's leading `_id` discriminator (`[{ _id, ... }]`). */
export function queryId(queryKey: readonly unknown[]): string | undefined {
    return (queryKey[0] as { _id?: string } | undefined)?._id;
}

export function matchesPath(
    queryKey: readonly unknown[],
    id: string,
    field: string,
    value: string,
): boolean {
    if (queryId(queryKey) !== id) return false;
    const path = (queryKey[0] as { path?: Record<string, unknown> }).path;
    return path?.[field] === value;
}
