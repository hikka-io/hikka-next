import { useQuery } from '@tanstack/react-query';

import getEdit from '@/services/api/edit/getEdit';

const useEdit = <T extends API.Edit>(editId: string, enabled?: boolean) => {
    return useQuery<T, Error>({
        queryKey: ['edit', editId],
        queryFn: () => getEdit({ edit_id: Number(editId) }),
        enabled,
    });
};

export default useEdit;
