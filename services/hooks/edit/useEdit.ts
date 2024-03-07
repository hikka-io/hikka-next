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
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: editId }),
        enabled,
    });
};

export default useEdit;
