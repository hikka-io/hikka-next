import { useSearchParams } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import getEditList from '@/services/api/edit/getEditList';

const useEditList = ({
    page,
    staleTime,
}: {
    page: string;
    staleTime?: number;
}) => {
    const searchParams = useSearchParams()!;

    const content_type = searchParams.get('content_type');
    const order = searchParams.get('order') || 'desc';
    const sort = searchParams.get('sort') || 'edit_id';
    const edit_status = searchParams.get('edit_status');

    return useQuery({
        queryKey: [
            'editList',
            { page, content_type, order, sort, edit_status },
        ],
        queryFn: () =>
            getEditList({
                page: Number(page),
                sort: [`${sort}:${order}`],
                status: edit_status as API.EditStatus,
                content_type: content_type as API.ContentType,
            }),
        staleTime,
    });
};

export default useEditList;
