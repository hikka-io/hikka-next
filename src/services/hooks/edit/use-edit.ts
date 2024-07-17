import { useQuery } from '@tanstack/react-query';

import getEdit, { Params } from '@/services/api/edit/getEdit';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    edit_id: props.edit_id,
});

export const key = (params: Params) => ['edit', params.edit_id];

const useEdit = <T extends API.Edit>(
    props: Params,
    options?: Hikka.QueryOptions,
) => {
    const params = paramsBuilder(props);

    return useQuery<T, Error>({
        queryKey: key(params),
        queryFn: () => getEdit({ params }),
        ...options,
    });
};

export const prefetchEdit = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getEdit({ params }),
    });
};

export default useEdit;
