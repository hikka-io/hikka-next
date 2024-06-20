import { useQuery } from '@tanstack/react-query';

import getEditList, { Params } from '@/services/api/edit/getEditList';
import { useSettingsContext } from '@/services/providers/settings-provider';
import getQueryClient from '@/utils/get-query-client';
import { convertTitle } from '@/utils/title-adapter';

export const paramsBuilder = (props: Params): Params => ({
    page: props.page || 1,
    content_type: props.content_type || undefined,
    sort: props.sort || undefined,
    status: props.status || undefined,
    author: props.author || undefined,
    moderator: props.moderator || undefined,
});

export const key = (params: Params) => ['edit-list', params];

const useEditList = (props: Params, options?: Hikka.QueryOptions) => {
    const { titleLanguage } = useSettingsContext();

    const { page, ...params } = paramsBuilder(props);

    return useQuery({
        queryKey: key({ ...params, page }),
        queryFn: () =>
            getEditList({
                page: Number(page),
                params: params,
            }),
        select: (data) => ({
            ...data,
            list: data.list.map((e) => ({
                ...e,
                content: convertTitle({
                    data: e.content,
                    titleLanguage: titleLanguage!,
                }),
            })),
        }),
        ...options,
    });
};

export const prefetchEditList = (props: Params) => {
    const { page, ...params } = paramsBuilder(props);
    const queryClient = getQueryClient();

    return queryClient.prefetchQuery({
        queryKey: key({ ...params, page }),
        queryFn: () =>
            getEditList({
                page: Number(page),
                params: params,
            }),
    });
};

export default useEditList;
