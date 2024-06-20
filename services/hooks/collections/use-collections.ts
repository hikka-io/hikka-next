import { QueryKey, useQuery } from '@tanstack/react-query';

import getCollections, {
    Params,
} from '@/services/api/collections/getCollections';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    page: props.page || 1,
    sort: props.sort || 'system_ranking',
});

export const key = (params: Params): QueryKey => ['collections', params];

const useCollections = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getCollections({
                page: params.page,
                params: { sort: params.sort },
            }),
        select: (data) => ({
            pagination: data.pagination,
            list: data.list.map((l) => ({
                ...l,
                collection: l.collection.map((c) => ({
                    ...c,
                    content: convertTitle({
                        data: c.content,
                        titleLanguage: titleLanguage!,
                    }),
                })),
            })),
        }),
        ...options,
    });
};

export const prefetchCollections = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getCollections({
                page: params.page,
                params: { sort: params.sort },
            }),
    });
};

export default useCollections;
