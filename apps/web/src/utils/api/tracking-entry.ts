/**
 * Picks the viewer's tracking entry from the two places it can arrive. The
 * three outcomes are distinct and drive different UI: an entry means tracked,
 * `null` means known-untracked, `undefined` means nobody knows yet and the
 * status still has to be fetched.
 */
export function resolveTrackingEntry<T>(
    supplied: T | null | undefined,
    embedded: T | null | undefined,
): T | null | undefined {
    return supplied === undefined ? embedded : supplied;
}
