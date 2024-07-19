import { useQuery } from '@tanstack/react-query';

import getPersonInfo, { Params } from '@/services/api/people/getPersonInfo';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params) => ['person', params.slug];

const usePersonInfo = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getPersonInfo({ params }),
    });
};

export const prefetchPersonInfo = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getPersonInfo({ params }),
    });
};

export default usePersonInfo;
