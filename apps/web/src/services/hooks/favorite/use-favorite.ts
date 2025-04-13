import { useQuery } from '@tanstack/react-query';

import getQueryClient from '@/utils/get-query-client';
import getFavourite, { Params } from '../../api/favourite/getFavourite';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
    content_type: props.content_type,
});

export const key = (params: Params) => [
    'favorite',
    params.slug,
    { content_type: params.content_type },
];

const useFavorite = (props: Params) => {
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getFavourite({ params }),
    });
};

export const prefetchFavorite = (props: Params) => {
    const params = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getFavourite({ params }),
    });
};

export default useFavorite;
