import { type QueryKey, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

import type { PaginationResponse } from '@hikka/api';

import { StickyPagination } from '@/components/ui/pagination';
import { resetPageList } from '@/utils/api/invalidate-content-state';

type Props = {
    pagination: Pick<PaginationResponse, 'page' | 'pages'>;
    resetQueryKey?: QueryKey;
};

const PagePagination = ({ pagination, resetQueryKey }: Props) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const updatePage = (newPage: number) => {
        if (resetQueryKey) {
            resetPageList(queryClient, resetQueryKey);
        }

        navigate({
            to: '.',
            search: (prev) => ({ ...prev, page: newPage }),
        });
    };

    return (
        <StickyPagination
            page={pagination.page}
            pages={pagination.pages}
            setPage={updatePage}
        />
    );
};

export default PagePagination;
