/** Cards shown in the collapsed (profile) favourites stack. */
export const FAVORITE_PREVIEW_SIZE = 6;

/**
 * Slices a favourites list for the collapsed stack. When there is more than a
 * full stack, the last slot is given up to the `+N` card instead of a poster,
 * so the stack always renders exactly `FAVORITE_PREVIEW_SIZE` items.
 */
export function favoritePreview<T>(
    list: T[] | undefined,
    total: number,
    extended?: boolean,
) {
    if (extended) {
        return {
            items: list ?? [],
            remainingCount: 0,
            remainingItem: undefined as T | undefined,
        };
    }

    const hasMore = total > FAVORITE_PREVIEW_SIZE;
    const items = (list ?? []).slice(
        0,
        hasMore ? FAVORITE_PREVIEW_SIZE - 1 : FAVORITE_PREVIEW_SIZE,
    );

    return {
        items,
        remainingCount: hasMore ? total - items.length : 0,
        // Poster displaced by the `+N` card — reused as its blurred backdrop.
        remainingItem: hasMore ? list?.[FAVORITE_PREVIEW_SIZE - 1] : undefined,
    };
}
