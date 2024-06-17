import { useQuery } from '@tanstack/react-query';

import getCollections, {
    Params,
} from '@/services/api/collections/getCollections';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const useCollections = (
    { page, sort = 'system_ranking' }: Params,
    options?: Hikka.QueryOptions,
) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery({
        queryKey: ['collections', { page, sort }],
        queryFn: () => getCollections({ page, params: { sort } }),
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

export default useCollections;
