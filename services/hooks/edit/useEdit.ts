import { useQuery } from '@tanstack/react-query';

import getEdit from '@/services/api/edit/getEdit';

const useEdit = <T extends API.Edit>({
    editId,
    enabled,
}: {
    editId: number;
    enabled?: boolean;
}) => {
    return useQuery<T, Error>({
        queryKey: ['edit', String(editId)],
        queryFn: () => getEdit({ params: { edit_id: editId } }),
        enabled,
    });
};

export default useEdit;
