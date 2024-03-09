import { useQuery } from '@tanstack/react-query';

import getEditList, { Response } from '@/services/api/edit/getEditList';

const useEditList = ({
    page,
    staleTime,
}: {
    page: string;
    staleTime?: number;
}) => {
    return useQuery({
        queryKey: ['editList', page],
        queryFn: () =>
            getEditList({
                page: Number(page),
            }),
        staleTime,
    });
};

export default useEditList;
