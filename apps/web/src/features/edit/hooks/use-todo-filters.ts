import { useNavigate } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import type { SortType } from '@/features/filters/sort';
import type { EditContentSearch } from '@/utils/search-schemas';

import type { TodoFiltersValue } from '../todo-content/todo-filters-value';
import type { TodoContentType } from './use-todo-content-list';

export function getTodoSortType(contentType: TodoContentType): SortType {
    if (
        contentType === ContentTypeEnum.CHARACTER ||
        contentType === ContentTypeEnum.PERSON
    ) {
        return 'todo_person';
    }

    return 'todo_content';
}

/**
 * Shared by the route, the summary and the list, which each query the same
 * endpoint and must agree on the active tab, page and filter values.
 */
export function useTodoFilters() {
    const navigate = useNavigate();
    const search = useFilterSearch<EditContentSearch>();

    const contentType: TodoContentType = search.tab ?? ContentTypeEnum.ANIME;
    const page = search.page || 1;
    const query = search.search;
    const sort = search.sort;
    const order = search.order;

    const filters: TodoFiltersValue = {
        issues: search.issues,
        types: search.types,
        mal_id: search.mal_id,
        genres: search.genres,
        studios: search.studios,
        magazines: search.magazines,
        seasons: search.seasons,
        statuses: search.statuses,
        ratings: search.ratings,
        years: search.years,
        content_type: search.content_type,
        content_slug: search.content_slug,
    };

    const setFilters = (value: TodoFiltersValue) => {
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...value, page: undefined }),
        });
    };

    return { contentType, page, filters, setFilters, query, sort, order };
}
