type ListKey = readonly [{ path?: unknown }];

export const keepPreviousList =
    (queryKey: ListKey) =>
    <T>(previous: T | undefined, previousQuery?: { queryKey: unknown }) =>
        previousQuery &&
        JSON.stringify((previousQuery.queryKey as ListKey)[0].path) ===
            JSON.stringify(queryKey[0].path)
            ? previous
            : undefined;
