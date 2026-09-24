import { expandSort } from '@/features/filters/sort';

import { useTodoContentList } from './use-todo-content-list';
import { getTodoSortType, useTodoFilters } from './use-todo-filters';

const PAGE_SIZE = 20;

/** The `/edit/content` list query, built from the URL so every consumer shares it. */
export function useTodoContentQuery() {
    const { contentType, page, filters, query, sort, order } = useTodoFilters();

    return useTodoContentList(contentType, {
        filters,
        page,
        size: PAGE_SIZE,
        query,
        sort: expandSort(getTodoSortType(contentType), sort, order),
    });
}
