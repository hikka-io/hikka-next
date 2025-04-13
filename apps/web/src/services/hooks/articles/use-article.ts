import { QueryKey, useQuery } from '@tanstack/react-query';

import { convertTitle } from '../../../utils/adapters/convert-title';
import getQueryClient from '../../../utils/get-query-client';
import getArticle, { Params } from '../../api/articles/getArticle';
import { useSettingsContext } from '../../providers/settings-provider';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
});

export const key = (params: Params): QueryKey => ['article', params.slug];

const useArticle = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () => getArticle({ params }),
        select: (data) => ({
            ...data,
            content: data.content
                ? convertTitle({
                      data: data.content,
                      titleLanguage: titleLanguage!,
                  })
                : undefined,
        }),
        ...options,
    });
};

export const prefetchArticle = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () => getArticle({ params }),
    });
};

export default useArticle;
