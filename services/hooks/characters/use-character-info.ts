import { QueryKey, useQuery } from '@tanstack/react-query';

import getCharacterInfo, {
    Params,
} from '@/services/api/characters/getCharacterInfo';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug || '',
});

export const key = (params: Params): QueryKey => ['character', params.slug];

const useCharacterInfo = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getCharacterInfo({ params }),
    });
};

export const prefetchCharacterInfo = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getCharacterInfo({ params }),
    });
};

export default useCharacterInfo;
