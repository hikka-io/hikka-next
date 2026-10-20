import type { FranchiseResponse } from '@hikka/api';

export type FranchiseEntry =
    | FranchiseResponse['anime'][number]
    | FranchiseResponse['manga'][number]
    | FranchiseResponse['novel'][number];

const when = (entry: FranchiseEntry) =>
    entry.start_date ??
    (entry.year ? Date.UTC(entry.year, 0) / 1000 : Number.POSITIVE_INFINITY);

/** Every franchise title except the current one, oldest first; undated titles go last. */
export function getFranchiseEntries(
    franchise: FranchiseResponse,
    currentSlug: string,
): FranchiseEntry[] {
    return [...franchise.anime, ...franchise.manga, ...franchise.novel]
        .filter((entry) => entry.slug !== currentSlug)
        .sort((a, b) => when(a) - when(b));
}
