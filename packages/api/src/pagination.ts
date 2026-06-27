interface Paginated {
    pagination: { page: number; pages: number };
}

/**
 * Shared `getNextPageParam`/`initialPageParam` for Hikka's page/pages pagination.
 */
export function paginationPageParam<T extends Paginated>() {
    return {
        initialPageParam: 1,
        getNextPageParam: (lastPage: T): number | null => {
            const next = lastPage.pagination.page + 1;
            return next > lastPage.pagination.pages ? null : next;
        },
    };
}
