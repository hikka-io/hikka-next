import { useNavigate } from '@tanstack/react-router';

import { ContentTypeEnum } from '@hikka/api';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';
import type { EditContentSearch } from '@/utils/search-schemas';

import type { TodoFiltersValue } from '../todo-content/todo-filters';
import type { TodoContentType } from './use-todo-content-list';

/**
 * Shared by the route, the summary and the list, which each query the same
 * endpoint and must agree on the active tab, page and filter values.
 */
export function useTodoFilters() {
    const navigate = useNavigate();
    const search = useFilterSearch<EditContentSearch>();

    const contentType: TodoContentType = search.tab ?? ContentTypeEnum.ANIME;
    const page = search.page || 1;

    const filters: TodoFiltersValue = {
        title_ua: search.title_ua,
        title_en: search.title_en,
        title_original: search.title_original,
        synopsis_ua: search.synopsis_ua,
        synopsis_en: search.synopsis_en,
        media_type: search.media_type,
        mal_id: search.mal_id,
        name_ua: search.name_ua,
        name_en: search.name_en,
        name_original: search.name_original,
        description_ua: search.description_ua,
        content_type: search.content_type,
        content_slug: search.content_slug,
    };

    const setFilters = (value: TodoFiltersValue) => {
        navigate({
            to: '.',
            search: (prev) => ({ ...prev, ...value, page: undefined }),
        });
    };

    return { contentType, page, filters, setFilters };
}
