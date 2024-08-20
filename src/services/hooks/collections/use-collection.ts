import { QueryKey, useQuery } from '@tanstack/react-query';

import getCollection, {
    Params,
} from '@/services/api/collections/getCollection';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';

export const paramsBuilder = (props: Params): Params => ({
    reference: props.reference || '',
});

export const key = (params: Params): QueryKey => [
    'collection',
    params.reference,
];

const useCollection = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getCollection({ params }),
        select: (data) => ({
            ...data,
            collection: data.collection.map((c) => ({
                ...c,
                content: {
                    ...convertTitle({
                        data: c.content,
                        titleLanguage: titleLanguage!,
                    }),
                },
            })),
        }),
        ...options,
    });
};

export const prefetchCollection = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getCollection({ params }),
    });
};

export default useCollection;
