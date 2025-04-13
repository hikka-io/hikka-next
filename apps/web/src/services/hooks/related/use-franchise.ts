import { QueryKey, useQuery } from '@tanstack/react-query';

import { convertTitleList } from '@/utils/adapters/convert-title';
import getQueryClient from '@/utils/get-query-client';
import getFranchise, { Params } from '../../api/related/getFranchise';
import { useSettingsContext } from '../../providers/settings-provider';

export const paramsBuilder = (props: Params): Params => ({
    slug: props.slug,
    content_type: props.content_type,
});

export const key = (params: Params): QueryKey => [
    'franchise',
    params.slug,
    params.content_type,
];

const useFranchise = (props: Params) => {
    const { titleLanguage } = useSettingsContext();
    const params = paramsBuilder(props);

    return useQuery({
        queryKey: key(params),
        queryFn: () =>
            getFranchise({
                params,
            }),
        select: (data) => ({
            list: [
                ...convertTitleList({
                    data: data.anime,
                    titleLanguage: titleLanguage!,
                }).flat(),
                ...convertTitleList({
                    data: data.manga,
                    titleLanguage: titleLanguage!,
                }).flat(),
                ...convertTitleList({
                    data: data.novel,
                    titleLanguage: titleLanguage!,
                }).flat(),
            ],
        }),
    });
};

export const prefetchFranchise = (props: Params) => {
    const queryClient = getQueryClient();
    const params = paramsBuilder(props);

    return queryClient.prefetchQuery({
        queryKey: key(params),
        queryFn: () =>
            getFranchise({
                params,
            }),
    });
};

export default useFranchise;
