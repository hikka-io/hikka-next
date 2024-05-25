import { useQuery } from '@tanstack/react-query';

import getEdit, { Params } from '@/services/api/edit/getEdit';

const useEdit = <T extends API.Edit>(
    { edit_id }: Params,
    options?: Hikka.QueryOptions,
) => {
    return useQuery<T, Error>({
        queryKey: ['edit', String(edit_id)],
        queryFn: () => getEdit({ params: { edit_id: edit_id } }),
        ...options,
    });
};

export default useEdit;
