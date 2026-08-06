import { useTodoContentList } from './use-todo-content-list';
import { useTodoFilters } from './use-todo-filters';

const PAGE_SIZE = 20;

/** The `/edit/content` list query, built from the URL so every consumer shares it. */
export function useTodoContentQuery() {
    const { contentType, page, filters } = useTodoFilters();

    return useTodoContentList(
        contentType,
        { ...filters, size: PAGE_SIZE },
        page,
    );
}
