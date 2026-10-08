export type StatusField = 'watch' | 'read';

export type FollowChange = { username: string; is_followed: boolean };

/**
 * Walk arbitrary nesting and let `patchNode` replace object nodes: it returns
 * the replacement (the record itself to keep it and stop descending) or
 * `undefined` to descend into its children. Preserves referential identity for
 * unchanged branches — so `setQueriesData` skips notifying observers of queries
 * that didn't contain the target, and React only re-renders what changed.
 */
function patchTree<T>(
    node: T,
    patchNode: (record: Record<string, unknown>) => unknown,
): T {
    if (Array.isArray(node)) {
        let changed = false;
        const mapped = node.map((child) => {
            const patched = patchTree(child, patchNode);
            if (patched !== child) changed = true;
            return patched;
        });
        return (changed ? mapped : node) as T;
    }

    if (node === null || typeof node !== 'object') return node;
    const record = node as Record<string, unknown>;

    const replaced = patchNode(record);
    if (replaced !== undefined) return replaced as T;

    let out: Record<string, unknown> | undefined;
    for (const key in record) {
        const patched = patchTree(record[key], patchNode);
        if (patched !== record[key]) out ??= { ...record };
        if (out) out[key] = patched;
    }
    return (out ?? node) as T;
}

/**
 * Return `node` with the embedded `field` array of every `{ slug, [field] }`
 * content object matching `slug` replaced by `next` (or cleared). A
 * status-bearing content node is never descended into: its children hold no
 * other matching content. The same object sits at different depths per query
 * (top-level in catalogs, `item.content` in collections, `item.anime` in
 * character/person rows), so one walk patches it wherever it lives.
 */
export function patchEmbeddedStatus<T>(
    node: T,
    slug: string,
    field: StatusField,
    next: object | undefined,
): T {
    return patchTree(node, (record) => {
        if (typeof record.slug !== 'string' || !Array.isArray(record[field]))
            return undefined;
        if (record.slug !== slug) return record;
        return { ...record, [field]: next ? [next] : [] };
    });
}

/** Set `is_followed` on every embedded user object of `username`. */
export function patchEmbeddedFollow<T>(
    node: T,
    { username, is_followed }: FollowChange,
): T {
    return patchTree(node, (record) => {
        if (
            typeof record.username !== 'string' ||
            typeof record.is_followed !== 'boolean'
        )
            return undefined;
        if (record.username !== username || record.is_followed === is_followed)
            return record;
        return { ...record, is_followed };
    });
}

/** Apply the user's new `score` to every embedded copy of the voted entity. */
export function patchEmbeddedVote<T>(
    node: T,
    reference: string,
    score: number,
): T {
    return patchTree(node, (record) => {
        if (
            record.reference !== reference ||
            typeof record.my_score !== 'number' ||
            typeof record.vote_score !== 'number'
        )
            return undefined;
        if (record.my_score === score) return record;
        return {
            ...record,
            my_score: score,
            vote_score: record.vote_score + score - record.my_score,
        };
    });
}
