import {
    type Client,
    type EditContentTypeEnum,
    type EditStatusEnum,
    getEditsInfiniteOptions,
    paginatedInfiniteOptions,
} from '@hikka/api';

import type { EditSearch } from '@/utils/search-schemas';
import { expandSort } from '@/utils/sort';

export const EDIT_LIST_PAGE_SIZE = 15;

export function editListOptions(search: EditSearch, client?: Client) {
    return paginatedInfiniteOptions(
        getEditsInfiniteOptions({
            body: {
                content_type:
                    (search.content_type as EditContentTypeEnum) || undefined,
                sort: expandSort('edit', search.sort, search.order),
                status: (search.edit_status as EditStatusEnum) || undefined,
                author: search.author,
                moderator: search.moderator,
            },
            query: { size: EDIT_LIST_PAGE_SIZE },
            client,
        }),
        Number(search.page || 1),
    );
}
