import { useQuery } from '@tanstack/react-query';

import getCollection, {
    Params,
} from '@/services/api/collections/getCollection';
import { useSettingsContext } from '@/services/providers/settings-provider';
import { convertTitle } from '@/utils/title-adapter';

const useCollection = ({ reference }: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();

    return useQuery({
        queryKey: ['collection', reference],
        queryFn: () => getCollection({ params: { reference } }),
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

export default useCollection;
